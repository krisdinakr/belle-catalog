import { ClientSession, ObjectId } from 'mongoose'

import { ICombination } from '@/contracts/combination'
import { Combination } from '@/models/combination'

export const combinationService = {
  create: (
    { attributes, images, price, stock }: Omit<ICombination, 'id'>,
    session?: ClientSession
  ) => {
    return new Combination({
      attributes,
      images,
      price,
      stock
    }).save({ session })
  },

  update: (
    combinationId: ObjectId,
    { attributes, images, price, stock }: Partial<Omit<ICombination, 'id'>>,
    session?: ClientSession
  ) => {
    return Combination.findByIdAndUpdate(
      combinationId,
      { attributes, images, price, stock },
      session
    )
  },

  getById: (id: ObjectId) => Combination.findById(id)
}
