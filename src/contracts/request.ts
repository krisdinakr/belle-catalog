import { Request } from 'express'
import { Document } from 'mongoose'

import { IUser } from './user'

export interface IContextRequest<T> extends Omit<Request, 'context'> {
  context: T
}

export interface IBodyRequest<T> extends Omit<Request, 'body'> {
  body: T
}

export interface IUserRequest {
  user: Omit<IUser, 'id'> & Document
  accessToken: string
}
