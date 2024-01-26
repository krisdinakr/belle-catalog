import { userController } from '@/controllers/userController'
import { authGuard } from '@/guards'
import { Router } from 'express'

export const user = (router: Router) => {
  router.get('/users/profile', authGuard.isAuth, userController.profile)
}
