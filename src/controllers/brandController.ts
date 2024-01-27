import { Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import winston from 'winston'

import { brandService } from '@/services/brandService'
import { CreateBrandPayload, UpdateBrandPayload } from '@/contracts/brand'
import {
  IBodyRequest,
  IBodyParamsRequest,
  IParamsRequest
} from '@/contracts/request'

export const brandController = {
  getAll: async (_: Request, res: Response) => {
    try {
      const brands = await brandService.getAll()

      return res.status(StatusCodes.OK).json({
        data: brands,
        message: ReasonPhrases.OK,
        error: false
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: StatusCodes.INTERNAL_SERVER_ERROR,
        error: true
      })
    }
  },

  getById: async ({ params: { id } }: IParamsRequest, res: Response) => {
    try {
      const brand = await brandService.getById(id)

      return res.status(StatusCodes.OK).json({
        data: brand,
        message: ReasonPhrases.OK,
        error: false
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: StatusCodes.INTERNAL_SERVER_ERROR,
        error: true
      })
    }
  },

  create: async (
    {
      body: { name, logo, description, desktopBanner, mobileBanner }
    }: IBodyRequest<CreateBrandPayload>,
    res: Response
  ) => {
    try {
      const brand = await brandService.create({
        name,
        logo,
        description,
        desktopBanner,
        mobileBanner
      })

      return res.status(StatusCodes.CREATED).json({
        data: brand,
        message: ReasonPhrases.CREATED,
        error: false
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        error: true
      })
    }
  },

  updateById: async (
    {
      params: { id },
      body: { logo, description, mobileBanner, desktopBanner }
    }: IBodyParamsRequest<UpdateBrandPayload>,
    res: Response
  ) => {
    try {
      const updatedBrand = await brandService.updateById(id, {
        logo,
        description,
        desktopBanner,
        mobileBanner
      })

      return res.status(StatusCodes.OK).json({
        data: updatedBrand,
        message: ReasonPhrases.OK,
        error: false
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        error: true
      })
    }
  },

  deleteById: async ({ params: { id } }: IParamsRequest, res: Response) => {
    try {
      await brandService.deleteById(id)

      return res.status(StatusCodes.OK).json({
        message: ReasonPhrases.OK,
        error: false
      })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        error: true
      })
    }
  }
}
