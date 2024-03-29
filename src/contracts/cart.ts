import { Model, ObjectId } from 'mongoose'

export interface ICart {
  id: ObjectId
  user: ObjectId
  product: ObjectId
  combination: ObjectId
  quantity: number
}

export type CartModel = Model<ICart>

export interface ICartPayload {
  action: 'add' | 'update'
  id?: ObjectId
  product?: ObjectId
  combination: ObjectId
  quantity: number
}
