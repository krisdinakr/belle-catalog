import { Response } from 'express'
import { startSession } from 'mongoose'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import winston from 'winston'

import { jwtSign } from '@/utils/jwt'
import { createHash } from '@/utils/hash'
import { createCryptoString } from '@/utils/cryptoString'
import { userService } from '@/services'
import { SignInPayload, SignOutPayload } from '@/contracts/auth'
import { IBodyRequest } from '@/contracts/request'
import { createDateAddDaysFromNow } from '@/utils/dates'
import { verificationService } from '@/services/verificationService'
import { ExpiresInDays } from '@/constants'

export const authController = {
  signIn: async (
    { body: { email, password } }: IBodyRequest<SignInPayload>,
    res: Response
  ) => {
    try {
      const user = await userService.getByEmail(email)

      const comparePassword = user?.comparePassword(password)
      if (!user || !comparePassword) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
          status: ReasonPhrases.NOT_FOUND
        })
      }

      const { accessToken } = jwtSign(user.id)

      return res.status(StatusCodes.OK).json({
        data: { accessToken },
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  signUp: async (
    { body: { email, password } }: IBodyRequest<SignOutPayload>,
    res: Response
  ) => {
    const session = await startSession()
    try {
      const isUserExist = await userService.isExistByEmail(email)

      if (isUserExist) {
        return res.status(StatusCodes.CONFLICT).json({
          message: ReasonPhrases.CONFLICT,
          status: StatusCodes.CONFLICT
        })
      }

      session.startTransaction()
      const hashedPassword = await createHash(password)

      const user = await userService.create(
        {
          email,
          password: hashedPassword
        },
        session
      )

      const cryptoString = createCryptoString()

      const dateFromNow = createDateAddDaysFromNow(ExpiresInDays.Verification)

      const verification = await verificationService.create(
        {
          userId: user.id,
          email,
          accessToken: cryptoString,
          expiresIn: dateFromNow
        },
        session
      )

      await userService.addVerificationToUser(
        {
          userId: user.id,
          verificationId: verification.id
        },
        session
      )

      const { accessToken } = jwtSign(user.id)

      await session.commitTransaction()
      session.endSession()

      return res.status(StatusCodes.OK).json({
        data: { accessToken },
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })
    } catch (error) {
      winston.error(error)

      if (session.inTransaction()) {
        await session.abortTransaction()
        session.endSession()
      }

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  }
}
