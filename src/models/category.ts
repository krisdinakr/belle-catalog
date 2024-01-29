import { Schema, model } from 'mongoose'

import { CategoryModel, ICategory } from '@/contracts/category'

const schema = new Schema<ICategory, CategoryModel>({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  parents: [{ type: Schema.Types.ObjectId, ref: 'Category' }]
})

schema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.__v

  return obj
}

export const Category = model<ICategory, CategoryModel>('Category', schema)
