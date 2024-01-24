import { Router } from 'express'

import { auth } from './auth'

const router: Router = Router()

const routes: { [key: string]: (router: Router) => void } = { auth }

for (const route in routes) {
  routes[route](router)
}

export { router }
