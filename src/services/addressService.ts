import { ClientSession, ObjectId } from 'mongoose'

import { Address } from '@/models'
import { IAddress } from '@/contracts/user'

export const addressService = {
  create: (
    {
      city,
      country,
      district,
      isDefault = false,
      isDeleted = false,
      name,
      phone,
      postalCode,
      province,
      street,
      user,
      recipientName
    }: IAddress,
    session?: ClientSession
  ) => {
    return new Address({
      city,
      country,
      district,
      isDefault,
      isDeleted,
      name,
      phone,
      postalCode,
      province,
      street,
      user,
      recipientName
    }).save({ session })
  },

  getByAddressId: (addressId: ObjectId | string) => Address.findById(addressId),

  getByUserId: (userId: ObjectId | string) =>
    Address.find({ user: userId }, { user: 0 }),

  updateById: (
    id: ObjectId | string,
    {
      city,
      country,
      district,
      isDefault,
      isDeleted,
      name,
      phone,
      postalCode,
      province,
      street,
      recipientName
    }: Omit<IAddress, 'user'>,
    session?: ClientSession
  ) => {
    return Address.findByIdAndUpdate(
      id,
      {
        city,
        country,
        district,
        isDefault,
        isDeleted,
        name,
        phone,
        postalCode,
        province,
        street,
        recipientName
      },
      { session }
    )
  },

  deletedById: (id: ObjectId | string, session: ClientSession) => {
    return Address.findByIdAndUpdate(id, { isDeleted: true }, { session })
  }
}
