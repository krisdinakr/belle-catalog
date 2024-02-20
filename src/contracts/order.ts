import { Model, ObjectId } from 'mongoose'
import { IAddress } from './user'

export enum OrderState {
  Pending = 'pending',
  OrderConfirmed = 'order_confirmed',
  Failed = 'failed',
  AwaitingShipment = 'awaiting_shipment',
  Shipped = 'shipped',
  Completed = 'completed'
}

export interface IProductItem {
  product: ObjectId
  combinations: ObjectId
  quantity: number
  price: number
}

export interface IOrder {
  id: ObjectId
  user: ObjectId
  products: IProductItem[]
  totalPrice: number
  shipping: IAddress
  deliveredDate: number
  state: OrderState
}

export type OrderModel = Model<IOrder>

export type OrderPayload = {
  cartId: ObjectId[] | string[]
  totalPrice: number
}
