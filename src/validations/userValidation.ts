import { Response, NextFunction } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import winston from 'winston'

import {
  IBodyParamsRequest,
  IBodyRequest,
  IParamsRequest
} from '@/contracts/request'
import { IAddress } from '@/contracts/user'
import { userService } from '@/services'
import { ICartPayload } from '@/contracts/cart'

export const userValidation = {
  addAddress: async (
    req: IBodyParamsRequest<Omit<IAddress, 'isDefault' | 'isDeleted' | 'user'>>,
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

      const user = await userService.getById(req.params.id)
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
          error: true
        })
      }

      if (
        req.body.city &&
        req.body.country &&
        req.body.district &&
        req.body.name &&
        req.body.phone &&
        req.body.postalCode &&
        req.body.province &&
        req.body.street
      ) {
        Object.assign(req.body, { user: user.id })
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

  getAddress: async (
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

      const user = await userService.getById(req.params.id)
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
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
