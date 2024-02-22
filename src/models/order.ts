import { IOrder, OrderModel } from '@/contracts/order'
import { Schema, model } from 'mongoose'

const schema = new Schema<IOrder, OrderModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          select: ['_id', 'brand', 'images', 'name', 'slug']
        },
        combinations: { type: Schema.Types.ObjectId, ref: 'Combination' },
        quantity: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
        }
      }
    ],
    totalPrice: {
      type: Number,
      required: true
    },
    shipping: {
      type: Schema.Types.ObjectId,
      ref: 'Address'
    },
    deliveredDate: {
      type: Number
    },
    state: {
      type: String
    },
    referenceCode: {
      type: String,
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

export const Order = model<IOrder, OrderModel>('Order', schema)
