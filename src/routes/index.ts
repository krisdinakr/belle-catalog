import { Router } from 'express'

import { auth } from './auth'
import { user } from './users'
import { brands } from './brands'
import { category } from './category'

const router: Router = Router()

const routes: { [key: string]: (router: Router) => void } = {
  auth,
  user,
  brands,
  category
}

for (const route in routes) {
  routes[route](router)
}

export { router }
