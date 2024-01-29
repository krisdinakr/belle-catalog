import { ClientSession } from 'mongoose'

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
  }
}
