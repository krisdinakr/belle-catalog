import { Schema, model } from 'mongoose'

import { IProduct, ProductModel } from '@/contracts/product'

const schema = new Schema<IProduct, ProductModel>(
  {
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Brand'
    },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    combinations: [{ type: Schema.Types.ObjectId, ref: 'Combination' }],
    description: {
      type: String,
      required: true
    },
    defaultCategory: { type: Schema.Types.ObjectId, ref: 'Category' },
    howToUse: {
      type: String,
      required: true
    },
    ingredients: {
      type: String,
      required: true
    },
    images: [{ type: Schema.Types.Mixed, required: true }],
    name: {
      type: String,
      required: true
    },
    parentCategory: { type: Schema.Types.ObjectId, ref: 'Category' },
    slug: {
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

export const Product = model<IProduct, ProductModel>('Product', schema)
