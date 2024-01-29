import { Model, ObjectId } from 'mongoose'

export interface ICategory {
  id: ObjectId
  name: string
  slug: string
  parents: ObjectId[]
}

export interface IUpdateCategoryPayload {
  name: string
  parentNames: string[]
}

export type CreateCategoryPayload = Pick<ICategory, 'name'>

export type CategoryModel = Model<ICategory>
