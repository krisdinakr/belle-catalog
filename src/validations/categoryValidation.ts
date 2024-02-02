import { Request, Response, NextFunction } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import winston from 'winston'

import { categoryService } from '@/services'
import {
  CreateCategoryPayload,
  IUpdateCategoryPayload
} from '@/contracts/category'
import {
  IBodyParamsRequest,
  IBodyRequest,
  IParamsRequest
} from '@/contracts/request'

export const categoryValidation = {
  getChildren: (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.query?.filter && typeof req.query.filter === 'string') {
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

  getCategoryByBrand: (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.query?.brand && typeof req.query.brand === 'string') {
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

  create: async (
    req: IBodyRequest<CreateCategoryPayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.body.name) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          error: true
        })
      }

      const existedName = await categoryService.getOneByName(
        req.body.name.toLowerCase()
      )

      if (existedName) {
        return res.status(StatusCodes.CONFLICT).json({
          message: ReasonPhrases.CONFLICT,
          error: true
        })
      }

      Object.assign(req.body, {
        name: req.body.name.toLowerCase()
      })

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
    req: IBodyParamsRequest<IUpdateCategoryPayload>,
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

      const category = await categoryService.getByCategoryId(req.params.id)
      if (!category) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
          error: true
        })
      }

      const parents =
        req.body.parentNames && req.body.parentNames.map(i => i.toLowerCase())

      Object.assign(req.body, {
        name: req.body.name ? req.body.name.toLowerCase() : undefined,
        parentNames: parents
      })

      if (req.body.name || req.body.parentNames) {
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

      const category = await categoryService.getByCategoryId(req.params.id)
      if (!category) {
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
  }
}
