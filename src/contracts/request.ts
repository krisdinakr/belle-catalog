import { Request } from 'express'
import { Document, ObjectId } from 'mongoose'
import { ParamsDictionary } from 'express-serve-static-core'

import { IUser } from './user'

export interface IContextRequest<T> extends Omit<Request, 'context'> {
  context: T
}

export interface IBodyRequest<T> extends Omit<Request, 'body'> {
  body: T
}

export interface IParamsRequest extends Omit<Request, 'params'> {
  params: ParamsDictionary
}

export interface IUserRequest {
  user: Omit<IUser, 'id'> & Document<ObjectId>
  accessToken: string
}

export interface IBodyParamsRequest<T>
  extends Omit<Request, 'params' | 'body'> {
  params: ParamsDictionary
  body: T
}

export interface IContextBodyRequest<T>
  extends Omit<Request, 'context' | 'body'> {
  context: IUserRequest
  body: T
}
