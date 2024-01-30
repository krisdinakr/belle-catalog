import { Router } from 'express'

import { productController } from '@/controllers/productController'

export const collection = (router: Router) => {
  router.get('/collections', productController.getCollections)
}
