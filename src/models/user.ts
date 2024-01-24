import { Schema, model } from 'mongoose'
import { compareSync } from 'bcrypt'

import { IUser, UserModel, IUserMethods } from '@/contracts/user'

const schema = new Schema<IUser, UserModel, IUserMethods>(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    verified: {
      type: Boolean,
      default: false
    },
    verifications: [{ type: Schema.Types.ObjectId, ref: 'Verification' }],
    resetPasswords: [{ type: Schema.Types.ObjectId, ref: 'ResetPassword' }]
  },
  { timestamps: true }
)

schema.methods.comparePassword = function (password: string) {
  return compareSync(password, this.password)
}

schema.methods.toJSON = function () {
  const obj = this.toObject()

  delete obj.password
  delete obj.verifications
  delete obj.resetPasswords

  return obj
}

export const User = model<IUser, UserModel>('User', schema)
