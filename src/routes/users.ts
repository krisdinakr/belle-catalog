import { Router } from 'express'

import { userController } from '@/controllers/userController'
import { authGuard } from '@/guards'
import { userValidation } from '@/validations'

export const user = (router: Router) => {
  router.get('/me', authGuard.isAuth, userController.me)

  router.get('/me/profile', authGuard.isAuth, userController.getProfile)

  router.post(
    '/me/profile',
    authGuard.isAuth,
    userValidation.updateProfile,
    userController.updateProfile
  )

  router.get('/users/me/address', authGuard.isAuth, userController.getAddress)

  router.post(
    '/users/me/address',
    authGuard.isAuth,
    userValidation.updateAddress,
    userController.updateAddress
  )

  router.get('/users/me/carts', authGuard.isAuth, userController.getCart)

  router.post(
    '/users/me/carts',
    authGuard.isAuth,
    userValidation.updateCart,
    userController.updateCart
  )

  router.delete(
    '/users/me/carts/:id',
    authGuard.isAuth,
    userValidation.deleteCart,
    userController.deleteOneCart
  )

  router.delete(
    '/users/me/carts',
    authGuard.isAuth,
    userController.deleteAllCart
  )
}
