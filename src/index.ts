import express, { Express } from 'express'
import 'dotenv/config'

import '@/infrastructure/logger'
import { mongoose, redis } from '@/dataSources'
import { corsMiddleware, authMiddleware } from './middlewares'
import { router } from './routes'

mongoose.run()
redis.run()

const app: Express = express()

app.use(
  express.json({ limit: '10mb' }),
  express.urlencoded({ limit: '10mb', extended: true }),
  corsMiddleware,
  authMiddleware
)

app.use('/api', router)

app.listen(process.env.APP_PORT, () =>
  console.log(`listening server on ${process.env.APP_URL}`)
)

export default app
