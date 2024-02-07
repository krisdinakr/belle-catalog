import { CartModel, ICart } from '@/contracts/cart'
import { Schema, model } from 'mongoose'

const schema = new Schema<ICart, CartModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    combination: {
      type: Schema.Types.ObjectId,
      ref: 'Combination'
    },
    quantity: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
)

schema.methods.toJSON = function () {
  const obj = this.toObject()

  delete obj.__v

  return obj
}

export const Cart = model<ICart, CartModel>('Cart', schema)
