import { Response, NextFunction } from 'express'
import winston from 'winston'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { IContextBodyRequest } from '@/contracts/request'
import { OrderPayload } from '@/contracts/order'

export const orderValidation = {
  createOrder: (
    req: IContextBodyRequest<OrderPayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (
        req.body.cartId &&
        Array.isArray(req.body.cartId) &&
        req.body.totalPrice
      ) {
        return next()
      }
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        error: true
      })
    }
  }
}
