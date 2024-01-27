import { Schema, model } from 'mongoose'

import { IAddress } from '@/contracts/user'

const schema = new Schema<IAddress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    city: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    isDefault: {
      type: Boolean,
      required: true
    },
    isDeleted: {
      type: Boolean,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    province: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export const Address = model<IAddress>('Address', schema)
