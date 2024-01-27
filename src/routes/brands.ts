import { Router } from 'express'
import { authGuard } from '@/guards'
import { brandValidation } from '@/validations'
import { brandController } from '@/controllers/brandController'

export const brands = (router: Router) => {
  router.get('/brands', brandController.getAll)

  router.get('/brands/:id', brandController.getById)

  router.post(
    '/brands',
    authGuard.isAdmin,
    brandValidation.create,
    brandController.create
  )

  router.patch(
    '/brands/:id',
    authGuard.isAdmin,
    brandValidation.update,
    brandController.updateById
  )

  router.delete(
    '/brands/:id',
    authGuard.isAdmin,
    brandValidation.delete,
    brandController.deleteById
  )
}
