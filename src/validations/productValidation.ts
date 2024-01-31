import { Response, NextFunction } from 'express'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import winston from 'winston'

import { IBodyRequest, IParamsRequest } from '@/contracts/request'
import { ICreateProductPayload } from '@/contracts/product'

export const productValidation = {
  getById: (req: IParamsRequest, res: Response, next: NextFunction) => {
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
  },

  getBySlug: (req: IParamsRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.params?.slug) {
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

  create: (
    req: IBodyRequest<ICreateProductPayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (
        !req.body.brand &&
        !req.body.combinations &&
        !req.body.description &&
        !req.body.defaultCategory &&
        !req.body.howToUse &&
        !req.body.ingredients &&
        !req.body.images &&
        !req.body.name &&
        !req.body.parentCategory
      ) {
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

  delete: async (req: IParamsRequest, res: Response, next: NextFunction) => {
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
