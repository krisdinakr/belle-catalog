import { Request, Response, NextFunction } from 'express'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import winston from 'winston'

export const searchValidation = {
  search: (req: Request, res: Response, next: NextFunction) => {
    try {
      if (
        (req.query?.filter && typeof req.query.filter === 'string') ||
        (req.query?.keyword && req.query.types)
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
  }
}
