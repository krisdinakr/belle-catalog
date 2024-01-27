import { ClientSession, ObjectId } from 'mongoose'

import { Verification } from '@/models'

export const verificationService = {
  create: (
    {
      userId,
      email,
      accessToken,
      expiresIn
    }: {
      userId: ObjectId
      email: string
      accessToken: string
      expiresIn: Date
    },
    session?: ClientSession
  ) =>
    new Verification({
      user: userId,
      email,
      accessToken,
      expiresIn
    }).save({ session })
}
