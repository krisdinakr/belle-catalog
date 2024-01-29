import { Schema, model } from 'mongoose'

import { ICombination, CombinationModel } from '@/contracts/combination'

const schema = new Schema<ICombination, CombinationModel>(
  {
    attributes: {
      type: Object
    },
    images: [{ type: String }],
    price: {
      type: Number,
      required: true
    },
    stock: {
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

export const Combination = model<ICombination, CombinationModel>(
  'Combination',
  schema
)
