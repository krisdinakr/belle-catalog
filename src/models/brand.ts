import { Schema, model } from 'mongoose'

import { BrandModel, IBrand } from '@/contracts/brand'

const schema = new Schema<IBrand, BrandModel>(
  {
    name: {
      type: String,
      required: true
    },
    logo: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    desktopBanner: {
      type: String,
      required: true
    },
    mobileBanner: {
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

export const Brand = model<IBrand, BrandModel>('Brand', schema)
