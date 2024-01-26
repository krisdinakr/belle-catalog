import { Response } from 'express'
import winston from 'winston'

import { IContextRequest, IUserRequest } from '@/contracts/request'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

export const userController = {
  profile: async (
    { context: user }: IContextRequest<IUserRequest>,
    res: Response
  ) => {
    try {
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
          status: StatusCodes.NOT_FOUND
        })
      }

      return res.status(StatusCodes.OK).json({
        data: {
          id: user.user.id,
          email: user.user.email,
          firstName: user.user.firstName,
          lastName: user.user.lastName
        },
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
  }
}
