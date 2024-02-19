import { Response, NextFunction } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import winston from 'winston'

import {
  IBodyRequest,
  IContextBodyRequest,
  IParamsRequest
} from '@/contracts/request'
import { IAddressPayload, ProfilePayload } from '@/contracts/user'
import { ICartPayload } from '@/contracts/cart'

export const userValidation = {
  updateProfile: async (
    req: IContextBodyRequest<ProfilePayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (
        req.body.firstName ||
        req.body.lastName ||
        req.body.phoneNumber ||
        req.body.photo ||
        req.body.dateOfBirth
      ) {
        return next()
      }

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        error: true
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
    req: IContextBodyRequest<IAddressPayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (
        req.body.action === 'update' &&
        req.body.id &&
        (req.body.city ||
          req.body.country ||
          req.body.district ||
          req.body.isDefault ||
          req.body.name ||
          req.body.phone ||
          req.body.postalCode ||
          req.body.province ||
          req.body.street ||
          req.body.recipientName)
      ) {
        return next()
      }

      if (
        req.body.action === 'add' &&
        req.body.city &&
        req.body.country &&
        req.body.district &&
        req.body.name &&
        req.body.phone &&
        req.body.postalCode &&
        req.body.province &&
        req.body.street &&
        req.body.recipientName
      ) {
        return next()
      }

      if (req.body.action === 'delete' && req.body.id && req.body.isDeleted) {
        return next()
      }

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        error: true
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
    req: IBodyRequest<ICartPayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (
        !req.body.action ||
        !req.body.combination ||
        !req.body.quantity ||
        !['add', 'update'].includes(req.body.action)
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          error: true
        })
      }

      if (req.body.action === 'update' && !req.body.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          error: true
        })
      }

      if (req.body.action === 'add' && !req.body.product) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          error: true
        })
      }

      return next()
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        error: true
      })
    }
  },

  deleteCart: async (
    req: IParamsRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          error: true
        })
      }

      return next()
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        error: true
      })
    }
  }
}
