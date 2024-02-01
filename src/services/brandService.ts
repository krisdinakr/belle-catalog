import { ObjectId } from 'mongoose'

import { Brand } from '@/models'
import { CreateBrandPayload, UpdateBrandPayload } from '@/contracts/brand'
import { generateSlug } from '@/utils/slug'

export const brandService = {
  getAll: () => Brand.find({}),

  getById: (brandId: ObjectId | string) => Brand.findById(brandId),

  getByName: (name: string) => Brand.findOne({ name }),

  getBySlug: (slug: string) => Brand.findOne({ slug }),

  create: ({
    name,
    logo,
    description,
    desktopBanner,
    mobileBanner
  }: CreateBrandPayload) => {
    return new Brand({
      name,
      logo,
      description,
      desktopBanner,
      mobileBanner,
      slug: generateSlug(name)
    }).save()
  },

  updateById: (
    brandId: ObjectId | string,
    { logo, description, desktopBanner, mobileBanner }: UpdateBrandPayload
  ) => {
    return Brand.findByIdAndUpdate(
      { _id: brandId },
      {
        logo,
        description,
        desktopBanner,
        mobileBanner
      }
    )
  },

  deleteById: (brandId: ObjectId | string) => Brand.findByIdAndDelete(brandId)
}
