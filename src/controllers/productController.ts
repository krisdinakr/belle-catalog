import { Response, Request } from 'express'
import { startSession } from 'mongoose'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import winston from 'winston'

import { ICreateProductPayload } from '@/contracts/product'
import { IBodyRequest, IParamsRequest } from '@/contracts/request'
import {
  brandService,
  categoryService,
  combinationService,
  productService
} from '@/services'

export const productController = {
  getAll: async (_: Request, res: Response) => {
    try {
      const products = await productService.getAll()

      return res.status(StatusCodes.OK).json({
        data: products,
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

  getById: async ({ params: { id } }: IParamsRequest, res: Response) => {
    try {
      const product = await productService.getById(id)

      if (product) {
        return res.status(StatusCodes.OK).json({
          data: product,
          message: ReasonPhrases.OK,
          error: false
        })
      }

      return res.status(StatusCodes.NOT_FOUND).json({
        message: ReasonPhrases.NOT_FOUND,
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
    const product = await productService.getBySlug(slug)
    if (product) {
      return res.status(StatusCodes.OK).json({
        data: product,
        message: ReasonPhrases.OK,
        error: false
      })
    }

    return res.status(StatusCodes.NOT_FOUND).json({
      message: ReasonPhrases.NOT_FOUND,
      error: false
    })
  },

  getCollections: async (_req: Request, res: Response) => {
    try {
      const products = await productService.getLatestProduct()

      return res.status(StatusCodes.OK).json({
        data: products,
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
    {
      body: {
        brand: brandName,
        combinations,
        description,
        defaultCategory,
        howToUse,
        ingredients,
        name,
        images,
        parentCategory
      }
    }: IBodyRequest<ICreateProductPayload>,
    res: Response
  ) => {
    const session = await startSession()
    try {
      // Find Brand
      const brand = await brandService.getByName(brandName)
      if (!brand) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Brand Not Found',
          error: true
        })
      }

      // Find Category
      const category = await categoryService.getOneByName(defaultCategory)
      if (!category) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Category Not Found',
          error: true
        })
      }
      const dataParentCategory =
        await categoryService.getOneByName(parentCategory)
      if (!dataParentCategory) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Category Not Found',
          error: true
        })
      }

      session.startTransaction()

      // Create Combinations
      const promises = Promise.all(
        combinations.map(i => combinationService.create({ ...i }, session))
      )
      const dataCombinations = await promises

      // Create Products
      const product = await productService.create({
        brand: brand.id,
        categories: category.parents,
        combinations: dataCombinations.map(i => i.id),
        description,
        defaultCategory: category.id,
        howToUse,
        ingredients,
        images,
        name,
        parentCategory: dataParentCategory.id
      })

      return res.status(StatusCodes.CREATED).json({
        data: product,
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

  delete: async ({ params: { id } }: IParamsRequest, res: Response) => {
    try {
      const deletedProduct = await productService.delete(id)

      return res.status(StatusCodes.OK).json({
        data: deletedProduct,
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
