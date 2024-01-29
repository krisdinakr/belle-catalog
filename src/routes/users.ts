import { Router } from 'express'

import { userController } from '@/controllers/userController'
import { authGuard } from '@/guards'
import { userValidation } from '@/validations'

export const user = (router: Router) => {
  router.get('/me', authGuard.isAuth, userController.me)

  router.get(
    '/users/:id/address',
    authGuard.isAuth,
    userValidation.getAddress,
    userController.getAddress
  )

  router.post(
    '/users/:id/address',
    authGuard.isAuth,
    userValidation.addAddress,
    userController.addAddress
  )
}
