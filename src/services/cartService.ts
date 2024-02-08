import { ObjectId } from 'mongoose'
import { Cart } from '@/models'

import { ICart } from '@/contracts/cart'

export const cartService = {
  getByUserId: (userId: ObjectId) =>
    Cart.find({ user: userId }).populate(['combination', 'product', 'user']),

  getByCartId: (cartId: ObjectId | string) => Cart.findById(cartId),

  getByProductAndCombination: ({
    product,
    combination
  }: Pick<ICart, 'product' | 'combination'>) => {
    return Cart.findOne({ product, combination })
  },

  create: ({ user, product, combination, quantity }: Omit<ICart, 'id'>) => {
    return new Cart({ user, product, combination, quantity }).save()
  },

  delete: (cartId: ObjectId | string) => Cart.findByIdAndDelete(cartId),

  update: (
    cartId: ObjectId,
    { combination, quantity }: Pick<ICart, 'combination' | 'quantity'>
  ) => Cart.findByIdAndUpdate(cartId, { combination, quantity })
}
