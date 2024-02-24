import { Response } from 'express'
import { startSession } from 'mongoose'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import winston from 'winston'

import {
  IContextBodyRequest,
  IContextRequest,
  IParamsRequest,
  IUserRequest
} from '@/contracts/request'
import { IAddressPayload, ProfilePayload } from '@/contracts/user'
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
          lastName: user.user.lastName,
          photo: user.user.photo
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

  getProfile: async (
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

      const userProfile = await userService.getById(user.user.id)

      return res.status(StatusCodes.OK).json({
        data: userProfile,
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

  updateProfile: async (
    {
      context: user,
      body: { firstName, lastName, phoneNumber, photo, dateOfBirth }
    }: IContextBodyRequest<ProfilePayload>,
    res: Response
  ) => {
    try {
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
          error: true
        })
      }

      const updatedUser = await userService.updateProfile(user.user.id, {
        firstName,
        lastName,
        phoneNumber,
        photo,
        dateOfBirth
      })

      return res.status(StatusCodes.OK).json({
        data: updatedUser,
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

  updateAddress: async (
    {
      context: user,
      body: {
        action,
        id,
        city,
        country,
        district,
        isDefault,
        isDeleted,
        name,
        phone,
        postalCode,
        province,
        street,
        recipientName
      }
    }: IContextBodyRequest<IAddressPayload>,
    res: Response
  ) => {
    const session = await startSession()
    try {
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
          error: true
        })
      }

      session.startTransaction()

      if (action === 'add') {
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
            recipientName,
            user: user.user.id
          },
          session
        )

        await userService.addAddressToUser({
          userId: user.user.id,
          addressId: address?.id
        })
      }

      if (action === 'update' && id) {
        const targetedAddress = await addressService.getByAddressId(id)

        if (!targetedAddress) {
          return res.status(StatusCodes.NOT_FOUND).json({
            message: ReasonPhrases.NOT_FOUND,
            error: true
          })
        }

        await addressService.updateById(
          id,
          {
            city,
            country,
            district,
            isDefault,
            isDeleted: false,
            name,
            phone,
            postalCode,
            province,
            street,
            recipientName
          },
          session
        )
      }

      if (action === 'delete' && id && isDeleted) {
        const targetedAddress = await addressService.getByAddressId(id)

        if (!targetedAddress) {
          return res.status(StatusCodes.NOT_FOUND).json({
            message: ReasonPhrases.NOT_FOUND,
            error: true
          })
        }

        await addressService.deletedById(id, session)
      }

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

  getAddress: async (
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

      const addresses = await addressService.getByUserId(user.user.id)

      if (!addresses) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
          error: true
        })
      }

      return res.status(StatusCodes.OK).json({
        data: addresses.filter(i => !i.isDeleted),
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
