import { ObjectId } from 'mongoose'

import { Category } from '@/models'
import { generateSlug } from '@/utils/slug'

export const categoryService = {
  getAll: () =>
    Category.find({}).populate('parents', { name: 1, _id: 1, slug: 1 }),

  getByCategoryId: (categoryId: ObjectId | string) =>
    Category.findById(categoryId),

  getOneByName: (name: string) =>
    Category.findOne({ name }).populate('parents'),

  getManyByNames: (names: string[]) => Category.find({ name: { $in: names } }),

  getByParents: (parents: ObjectId) => {
    return Category.find({
      parents: {
        $in: parents
      }
    })
  },

  create: (name: string) =>
    new Category({
      name,
      slug: generateSlug(name)
    }).save(),

  updateById: (
    categoryId: ObjectId | string,
    { name, parents }: { name: string; parents: ObjectId[] }
  ) => {
    return Category.findByIdAndUpdate({ _id: categoryId }, { name, parents })
  },

  deleteById: (categoryId: ObjectId | string) =>
    Category.findByIdAndDelete(categoryId)
}
