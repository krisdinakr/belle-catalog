import { searchController } from '@/controllers/searchController'
import { searchValidation } from '@/validations'
import { Router } from 'express'

export const search = (router: Router) => {
  router.get('/search', searchValidation.search, searchController.search)
}
