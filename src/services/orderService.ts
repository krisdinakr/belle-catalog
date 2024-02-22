import { IOrder } from '@/contracts/order'
import { Order } from '@/models'
import { ClientSession, ObjectId } from 'mongoose'

export const orderService = {
  getByOrderId: (orderId: ObjectId | string) => {
    return Order.findById(orderId)
  },

  getByUserId: (userId: ObjectId) => {
    return Order.find({ user: userId }, { user: 0 })
      .populate({
        path: 'products.product',
        populate: { path: 'brand', select: ['_id', 'name', 'slug'] },
        select: ['_id', 'brand', 'images', 'name', 'slug']
      })
      .populate('products.combinations', ['stock', 'price', '_id'])
  },

  createOrder: (
    { user, products, totalPrice }: Omit<IOrder, 'id'>,
    session: ClientSession
  ) => {
    return new Order({
      user,
      products,
      totalPrice
    }).save({ session })
  }
}
