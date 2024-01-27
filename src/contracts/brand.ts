import { Model, ObjectId } from 'mongoose'

export interface IBrand {
  id: ObjectId
  name: string
  logo: string
  slug: string
  description: string
  desktopBanner: string
  mobileBanner: string
}

export type BrandModel = Model<IBrand>

export type CreateBrandPayload = Omit<IBrand, 'id' | 'slug'>

export type UpdateBrandPayload = Omit<IBrand, 'id' | 'name' | 'slug'>
