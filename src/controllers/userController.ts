import { Response } from 'express'
import { startSession } from 'mongoose'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import winston from 'winston'

import {
  IBodyRequest,
  IContextBodyRequest,
  IContextRequest,
  IParamsRequest,
  IUserRequest
} from '@/contracts/request'
import { IAddress } from '@/contracts/user'
import { addressService } from '@/services'
import { userService, cartService } from '@/services'
import { ICartPayload } from '@/contracts/cart'

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
  },

  getCart: async (
    { context: user }: IContextRequest<IUserRequest>,
    res: Response
  ) => {
    try {
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
          error: true
        })
      }

      const cart = await cartService.getByUserId(user.user.id)
      return res.status(StatusCodes.OK).json({
        data: cart,
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

  updateCart: async (
    {
      context: user,
      body: { action, id, product, combination, quantity }
    }: IContextBodyRequest<ICartPayload>,
    res: Response
  ) => {
    try {
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
          error: true
        })
      }

      if (action === 'add' && product) {
        const existingCart = await cartService.getByProductAndCombination({
          product,
          combination
        })

        if (existingCart) {
          const updatedCart = await cartService.update(existingCart.id, {
            combination: existingCart.combination,
            quantity: existingCart.quantity + quantity
          })

          return res.status(StatusCodes.OK).json({
            data: updatedCart,
            message: ReasonPhrases.OK,
            error: false
          })
        } else {
          const cart = await cartService.create({
            user: user.user.id,
            product,
            combination,
            quantity
          })

          return res.status(StatusCodes.CREATED).json({
            data: cart,
            message: ReasonPhrases.CREATED,
            error: false
          })
        }
      }

      if (action === 'update' && id) {
        const targetedCart = await cartService.getByCartId(id)

        if (!targetedCart) {
          return res.status(StatusCodes.NOT_FOUND).json({
            message: ReasonPhrases.NOT_FOUND,
            error: true
          })
        }

        const updatedCart = await cartService.update(targetedCart.id, {
          combination,
          quantity
        })

        return res.status(StatusCodes.OK).json({
          data: updatedCart?.id,
          message: ReasonPhrases.OK,
          error: false
        })
      }
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        error: true
      })
    }
  },

  deleteOneCart: async ({ params: { id } }: IParamsRequest, res: Response) => {
    try {
      await cartService.deleteOne(id)

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

  deleteAllCart: async (
    { context: user }: IContextRequest<IUserRequest>,
    res: Response
  ) => {
    try {
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
          error: true
        })
      }

      await cartService.deleteMany(user.user.id)
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
  }
}
