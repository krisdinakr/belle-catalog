import { Model, ObjectId } from 'mongoose'

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
  images: string[]
  price: number
  stock: number
}

export type CombinationModel = Model<ICombination>
