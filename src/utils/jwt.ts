import jwt, { Secret } from 'jsonwebtoken'
import { ObjectId } from 'mongoose'

import { IAccessToken, IJwtUser } from '@/contracts/jwt'

const secret: Secret = process.env.JWT_SECRET!

export const jwtSign = (id: ObjectId): IAccessToken => {
  const accessToken = jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRATION
  })
  return { accessToken }
}

export const jwtVerify = ({ accessToken }: { accessToken: string }) => {
  return jwt.verify(accessToken, secret) as IJwtUser
}
