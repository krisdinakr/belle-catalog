import { Router } from 'express'

import { productController } from '@/controllers/productController'
import { productValidation } from '@/validations'
import { authGuard } from '@/guards'

export const product = (router: Router) => {
  router.get('/products', productController.getAll)

  router.get(
    '/products/:id',
    productValidation.getById,
    productController.getById
  )

  router.post(
    '/products',
    authGuard.isAdmin,
    productValidation.create,
    productController.create
  )

  router.delete(
    '/products/:id',
    authGuard.isAdmin,
    productValidation.delete,
    productController.delete
  )
}
