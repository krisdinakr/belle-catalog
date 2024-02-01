import { Response, NextFunction } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import winston from 'winston'

import { CreateBrandPayload, UpdateBrandPayload } from '@/contracts/brand'
import {
  IBodyRequest,
  IBodyParamsRequest,
  IParamsRequest
} from '@/contracts/request'
import { brandService } from '@/services'

export const brandValidation = {
  create: (
    req: IBodyRequest<CreateBrandPayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (
        !req.body.name ||
        !req.body.logo ||
        !req.body.description ||
        !req.body.desktopBanner ||
        !req.body.mobileBanner
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

  update: async (
    req: IBodyParamsRequest<UpdateBrandPayload>,
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

      const brand = await brandService.getById(req.params.id)
      if (!brand) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
          error: true
        })
      }

      if (
        req.body.description ||
        req.body.logo ||
        req.body.desktopBanner ||
        req.body.mobileBanner
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

  delete: async (req: IParamsRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          error: true
        })
      }

      const brand = await brandService.getById(req.params.id)
      if (!brand) {
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

  getBySlug: async (req: IParamsRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.params.slug) {
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
