import { Router } from 'express'

import { authGuard } from '@/guards'
import { authValidation } from '@/validations'
import { authController } from '@/controllers/authController'

export const auth = (router: Router): void => {
  router.post(
    '/auth/sign-in',
    authGuard.isGuest,
    authValidation.signIn,
    authController.signIn
  )
}
