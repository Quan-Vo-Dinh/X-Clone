import { NextFunction, Request, Response } from 'express'
import { pick } from 'lodash'

type allowFields<T> = Array<keyof T>

export const filterMiddleware =
  <T>(allowedFields: allowFields<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.body = pick(req.body, allowedFields)
    next()
  }
