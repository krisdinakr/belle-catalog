/* eslint-disable no-await-in-loop */
import { Response } from 'express'
import winston from 'winston'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import {
  IContextBodyRequest,
  IContextRequest,
  IUserRequest
} from '@/contracts/request'
import { IProductItem, OrderPayload, OrderState } from '@/contracts/order'
import {
  addressService,
  cartService,
  combinationService,
  orderService
} from '@/services'
import { ObjectId, startSession } from 'mongoose'
import { ICombination } from '@/contracts/combination'
import { createDateAddDaysFromNow } from '@/utils/dates'

export const orderController = {
  getOrder: async (
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

      const orders = await orderService.getByUserId(user.user.id)
      return res.status(StatusCodes.OK).json({
        data: orders,
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

  createOrder: async (
    {
      context: user,
      body: { totalPrice, cartId }
    }: IContextBodyRequest<OrderPayload>,
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
      // Check cart by id
      const carts = await cartService.getManyByCartId(cartId)

      if (carts && carts.length > 0) {
        const products: IProductItem[] = []
        for (const cart of carts) {
          // Update stock on combination
          const combination = cart.combination as ICombination & ObjectId
          const stock = combination.stock - cart.quantity
          await combinationService.update(combination.id, { stock }, session)
          // Delete cart
          await cartService.deleteOne(cart.id)

          // Create product item
          const item: IProductItem = {
            product: cart.product,
            combinations: combination,
            quantity: cart.quantity,
            price: combination.price * cart.quantity
          }
          products.push(item)
        }

        // Get shipping address
        const address = await addressService.getByUserId(user.user.id)
        const shipping = address.filter(i => i.isDefault)
        const deliveredDate = createDateAddDaysFromNow(7).getTime()

        // Create order
        const orders = await orderService.createOrder(
          {
            user: user.user.id,
            products,
            totalPrice,
            shipping: shipping[0].id,
            deliveredDate,
            state: OrderState.AwaitingShipment
          },
          session
        )

        await session.commitTransaction()
        session.endSession()

        return res.status(StatusCodes.CREATED).json({
          data: orders,
          message: ReasonPhrases.CREATED,
          error: false
        })
      }

      return res.status(StatusCodes.NOT_FOUND).json({
        message: ReasonPhrases.NOT_FOUND,
        error: true
      })
    } catch (error) {
      winston.error(error)

      if (session.inTransaction()) {
        await session.abortTransaction()
        session.endSession()
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        error: true
      })
    }
  }
}
