import { Response } from 'express'
import { startSession } from 'mongoose'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import winston from 'winston'

import {
  IBodyRequest,
  IContextRequest,
  IParamsRequest,
  IUserRequest
} from '@/contracts/request'
import { IAddress } from '@/contracts/user'
import { addressService } from '@/services'
import { userService } from '@/services'

export const userController = {
  me: async (
    { context: user }: IContextRequest<IUserRequest>,
    res: Response
  ) => {
    try {
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
          status: StatusCodes.NOT_FOUND
        })
      }

      return res.status(StatusCodes.OK).json({
        data: {
          id: user.user.id,
          email: user.user.email,
          firstName: user.user.firstName,
          lastName: user.user.lastName
        },
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  addAddress: async (
    {
      body: {
        city,
        country,
        district,
        name,
        phone,
        postalCode,
        province,
        street,
        user
      }
    }: IBodyRequest<Omit<IAddress, 'isDefault' | 'isDeleted'>>,
    res: Response
  ) => {
    const session = await startSession()
    try {
      session.startTransaction()

      const address = await addressService.create(
        {
          city,
          country,
          district,
          isDefault: false,
          isDeleted: false,
          name,
          phone,
          postalCode,
          province,
          street,
          user
        },
        session
      )

      await userService.addAddressToUser({
        userId: user,
        addressId: address.id
      })

      await session.commitTransaction()
      session.endSession()

      return res.status(StatusCodes.OK).json({
        message: ReasonPhrases.OK,
        error: false
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        error: true
      })
    }
  },

  getAddress: async ({ params: { id } }: IParamsRequest, res: Response) => {
    try {
      const addresses = await addressService.getByUserId(id)

      if (!addresses) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
          error: true
        })
      }

      return res.status(StatusCodes.OK).json({
        data: addresses,
        message: ReasonPhrases.OK,
        error: false
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        error: true
      })
    }
  }
}
