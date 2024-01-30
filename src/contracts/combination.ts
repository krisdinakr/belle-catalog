import { Model, ObjectId } from 'mongoose'
import { IImage } from './product'

export interface IAttributes {
  [key: string]: IAttributeItem
}

export interface IAttributeItem {
  name: string
  value: string
}

export interface ICombination {
  id: ObjectId
  attributes: IAttributes
  images: IImage[]
  price: number
  stock: number
}

export type CombinationModel = Model<ICombination>
