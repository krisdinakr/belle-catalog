import { Model, ObjectId } from 'mongoose'

export interface IVerification {
  email: string
  accessToken: string
  expiresIn: Date
  user: ObjectId
}

export interface IAddress {
  city: string
  country: string
  district: string
  isDefault: boolean
  isDeleted: boolean
  name: string
  phone: string
  postalCode: string
  province: string
  street: string
  recipientName: string
  user: ObjectId
}

export interface IUser {
  id: ObjectId
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber: string
  photo: string
  dateOfBirth: number
  role: number
  verified: boolean
  verifications?: ObjectId[]
  resetPasswords?: ObjectId[]
  address?: ObjectId[]
}

export interface IUserMethods {
  comparePassword: (password: string) => boolean
}

export type UserModel = Model<IUser, unknown, IUserMethods>

export interface IAddressPayload extends Omit<IAddress, 'user'> {
  action: 'add' | 'update' | 'delete'
  id?: ObjectId | string
}

export type ProfilePayload = Pick<
  IUser,
  'firstName' | 'lastName' | 'phoneNumber' | 'photo' | 'dateOfBirth'
>
