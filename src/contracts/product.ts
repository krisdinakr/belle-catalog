import { Model, ObjectId } from 'mongoose'

import { ICombination } from './combination'

export interface IImage {
  isCover: boolean
  url: string
}

export interface IProduct {
  id: ObjectId
  brand: ObjectId
  categories: ObjectId[]
  combinations: ObjectId[]
  description: string
  defaultCategory: ObjectId
  howToUse: string
  ingredients: string
  images: IImage[]
  name: string
  parentCategory: ObjectId
  slug: string
}

export type ProductModel = Model<IProduct>

export interface ICreateProductPayload {
  brand: string
  combinations: Omit<ICombination, 'id'>[]
  description: string
  defaultCategory: string
  howToUse: string
  ingredients: string
  images: IImage[]
  name: string
  parentCategory: string
}
