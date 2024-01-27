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
      user
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
      user
    }).save({ session })
  },

  getByAddressId: (addressId: ObjectId | string) => Address.findById(addressId),

  getByUserId: (userId: ObjectId | string) => Address.find({ user: userId }),

  updateById: (
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
      street
    }: Omit<IAddress, 'user'>,
    session?: ClientSession
  ) => {
    return Address.findByIdAndUpdate(
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
        street
      },
      { session }
    )
  }
}
