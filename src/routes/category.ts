import { Router } from 'express'

import { categoryController } from '@/controllers/categoryController'
import { authGuard } from '@/guards'
import { categoryValidation } from '@/validations'

export const category = (router: Router) => {
  router.get('/categories', categoryController.getAll)

  router.get(
    '/categories/distinct/products',
    categoryValidation.getCategoryByBrand,
    categoryController.getByBrand
  )

  router.get(
    '/categories/children',
    categoryValidation.getChildren,
    categoryController.getChildren
  )

  router.post(
    '/categories',
    authGuard.isAdmin,
    categoryValidation.create,
    categoryController.create
  )

  router.patch(
    '/categories/:id',
    authGuard.isAdmin,
    categoryValidation.update,
    categoryController.update
  )

  router.delete(
    '/categories/:id',
    authGuard.isAdmin,
    categoryValidation.delete,
    categoryController.delete
  )
}
