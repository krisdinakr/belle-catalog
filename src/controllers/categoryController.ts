import { Request, Response } from 'express'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import winston from 'winston'
import { Document, ObjectId } from 'mongoose'

import { brandService, categoryService, productService } from '@/services'
import { IBodyRequest, IParamsRequest } from '@/contracts/request'
import {
  CreateCategoryPayload,
  ICategory,
  IUpdateCategoryPayload
} from '@/contracts/category'

interface IChildren extends Omit<ICategory, 'id' | 'parents'> {
  _id: ObjectId
  children: IChildren[]
}

function getChildren(
  source: Array<Omit<ICategory, 'id'> & Document>,
  rootId: ObjectId,
  dept: number
) {
  const data: IChildren[] = []
  for (let i = 0; i < source.length; i++) {
    if (
      source[i].parents &&
      source[i].parents.length === dept &&
      source[i].parents.map(p => p.toString()).includes(rootId.toString())
    ) {
      data.push({
        name: source[i].name,
        slug: source[i].slug,
        _id: source[i]._id,
        children: getChildren(source, source[i]._id, dept + 1)
      })
    }
  }
  return data
}

export const categoryController = {
  getAll: async ({ query }: Request, res: Response) => {
    try {
      const categories = await categoryService.getAll(query)

      return res.status(StatusCodes.OK).json({
        data: categories,
        message: ReasonPhrases.OK,
        error: false
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        error: true
      })
    }
  },

  getBySlug: async ({ params: { slug } }: IParamsRequest, res: Response) => {
    try {
      const category = await categoryService.getBySlug(slug)

      return res.status(StatusCodes.OK).json({
        data: category,
        message: ReasonPhrases.OK,
        error: true
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        error: true
      })
    }
  },

  getChildren: async ({ query: { filter } }: Request, res: Response) => {
    try {
      if (typeof filter === 'string') {
        const objFilter: { name: string } = JSON.parse(filter)

        const category: (Omit<ICategory, 'id'> & Document) | null =
          await categoryService.getOneByName(objFilter.name.toLowerCase())

        if (!category) {
          return res.status(StatusCodes.NOT_FOUND).json({
            message: ReasonPhrases.NOT_FOUND,
            error: true
          })
        }

        const dataChildren = await categoryService.getByParents(category._id)

        const children = getChildren(dataChildren, category._id, 1)

        return res.status(StatusCodes.OK).json({
          data: {
            _id: category._id,
            name: category.name,
            slug: category.slug,
            children
          },
          message: ReasonPhrases.OK,
          error: false
        })
      }

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        error: true
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        error: true
      })
    }
  },

  getByBrand: async ({ query }: Request, res: Response) => {
    try {
      const brand = String(query.brand)
      const targetedBrand = await brandService.getBySlug(brand)
      if (!targetedBrand) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
          error: true
        })
      }

      const rootCategory: (Omit<ICategory, 'id'> & Document) | null =
        await categoryService.getBySlug('shop-by-category')

      const products = await productService.filter({ brand })
      const categories: Array<Omit<ICategory, 'id'> & Document> = []
      products.forEach(product => {
        product.categories.forEach((cat: Omit<ICategory, 'id'> & Document) => {
          if (!categories?.find(i => i._id === cat._id)) {
            categories.push(cat)
          }
        })
      })

      const result = getChildren(categories, rootCategory?.id, 1)

      return res.status(StatusCodes.OK).json({
        data: result,
        message: ReasonPhrases.OK,
        error: false
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        error: true
      })
    }
  },

  create: async (
    { body: { name } }: IBodyRequest<CreateCategoryPayload>,
    res: Response
  ) => {
    try {
      const category = await categoryService.create(name)

      return res.status(StatusCodes.CREATED).json({
        data: category,
        message: ReasonPhrases.CREATED,
        error: false
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        error: true
      })
    }
  },

  update: async (
    {
      params,
      body: { name, parentNames }
    }: IBodyRequest<IUpdateCategoryPayload>,
    res: Response
  ) => {
    try {
      const dataParents = await categoryService.getManyByNames(parentNames)

      if (dataParents && dataParents.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
          error: true
        })
      }
      const category = await categoryService.updateById(params.id, {
        name,
        parents: dataParents.map(i => i.id)
      })

      return res.status(StatusCodes.OK).json({
        data: category,
        message: ReasonPhrases.OK
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        error: true
      })
    }
  },

  delete: async ({ params: { id } }: IParamsRequest, res: Response) => {
    try {
      await categoryService.deleteById(id)

      return res.status(StatusCodes.OK).json({
        message: ReasonPhrases.OK,
        error: false
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        error: true
      })
    }
  }
}
