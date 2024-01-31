import { ClientSession, ObjectId } from 'mongoose'

import { IProduct } from '@/contracts/product'
import { Product } from '@/models/product'
import { generateSlug } from '@/utils/slug'

export const productService = {
  getAll: () =>
    Product.find({}).populate([
      'brand',
      'categories',
      'combinations',
      'defaultCategory',
      'parentCategory'
    ]),

  getById: (id: ObjectId | string) => Product.findById({ _id: id }),

  getBySlug: (slug: string) =>
    Product.findOne({ slug }).populate([
      'brand',
      'categories',
      'combinations',
      'defaultCategory',
      'parentCategory'
    ]),

  getLatestProduct: () =>
    Product.find()
      .sort({ createdAt: -1 })
      .limit(4)
      .populate([
        'brand',
        'categories',
        'combinations',
        'defaultCategory',
        'parentCategory'
      ]),

  create: (data: Omit<IProduct, 'id' | 'slug'>, session?: ClientSession) => {
    return new Product({
      ...data,
      slug: generateSlug(data.name)
    }).save({ session })
  },

  delete: (id: ObjectId | string) => Product.findByIdAndDelete(id)
}
