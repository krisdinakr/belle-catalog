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
      .populate('products.combinations', [
        'stock',
        'price',
        '_id',
        'attributes'
      ])
      .populate('shipping', [
        'city',
        'country',
        'district',
        'province',
        'street'
      ])
  },

  createOrder: (
    {
      user,
      products,
      totalPrice,
      shipping,
      deliveredDate,
      state,
      referenceCode
    }: Omit<IOrder, 'id'>,
    session: ClientSession
  ) => {
    return new Order({
      user,
      products,
      totalPrice,
      shipping,
      deliveredDate,
      state,
      referenceCode
    }).save({ session })
  }
}
