import { ClientSession, ObjectId } from 'mongoose'

import { User } from '@/models'
import { UserRole } from '@/constants'
import { ProfilePayload } from '@/contracts/user'

export const userService = {
  create: (
    {
      email,
      password,
      firstName,
      lastName,
      role = UserRole.user,
      verified = false
    }: {
      email: string
      password: string
      firstName: string
      lastName: string
      role: number
      verified?: boolean
    },
    session?: ClientSession
  ) =>
    new User({
      email,
      password,
      firstName,
      lastName,
      role,
      verified
    }).save({ session }),

  getById: (userId: ObjectId | string) =>
    User.findById(userId, { address: 0, verified: 0 }),

  getByEmail: (email: string) => User.findOne({ email }),

  isExistByEmail: (email: string) => User.exists({ email }),

  updateProfile: (
    userId: ObjectId,
    { firstName, lastName, phoneNumber, photo, dateOfBirth }: ProfilePayload
  ) => {
    return User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        phoneNumber,
        photo,
        dateOfBirth
      },
      {
        fields: [
          'email',
          'firstName',
          'lastName',
          'phoneNumber',
          'photo',
          'dateOfBirth'
        ]
      }
    )
  },

  updatePasswordByUserId: (
    userId: ObjectId,
    password: string,
    session?: ClientSession
  ) => {
    const data = [{ _id: userId }, { password, resetPasswords: [] }]

    let params = null

    if (session) {
      params = [...data, { session }]
    } else {
      params = data
    }

    return User.updateOne(...params)
  },

  addVerificationToUser: async (
    {
      userId,
      verificationId
    }: {
      userId: ObjectId
      verificationId: ObjectId
    },
    session?: ClientSession
  ) => {
    let options = {}

    if (session) {
      options = { session }
    }

    const user = await User.findOne({ _id: userId }, null, options)

    if (user) {
      if (!user.verifications) {
        user.verifications = []
      }
      user.verifications.push(verificationId)
      await user.save({ session })
    }
  },

  addAddressToUser: async (
    {
      userId,
      addressId
    }: {
      userId: ObjectId
      addressId: ObjectId
    },
    session?: ClientSession
  ) => {
    let options = {}

    if (session) {
      options = { session }
    }

    const user = await User.findOne({ _id: userId }, null, options)

    if (user) {
      if (!user.address) {
        user.address = []
      }
      user.address.push(addressId)
      await user.save({ session })
    }
  }
}
