import { productService } from '@/services'
import { Request, Response } from 'express'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import winston from 'winston'

export const searchController = {
  search: async ({ query: { filter } }: Request, res: Response) => {
    try {
      const objFilter =
        filter && typeof filter === 'string' ? JSON.parse(filter) : null

      const result = await productService.filter(objFilter)
      return res.status(StatusCodes.OK).json({ data: result })
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        error: true
      })
    }
  }
}
