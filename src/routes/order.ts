import { orderController } from '@/controllers/orderController'
import { authGuard } from '@/guards'
import { orderValidation } from '@/validations/orderValidation'
import { Router } from 'express'

export const order = (router: Router) => {
  router.get('/orders', authGuard.isAuth, orderController.getOrder)

  router.post(
    '/orders',
    authGuard.isAuth,
    orderValidation.createOrder,
    orderController.createOrder
  )
}
