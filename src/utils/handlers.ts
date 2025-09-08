import { Request, Response, NextFunction, RequestHandler } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ParsedQs } from 'qs'

// type func = (req: Request, res: Response, next: NextFunction) => Promise<void>

export const wrapRequestHandler = <P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = ParsedQs>(
  func: RequestHandler<P, ResBody, ReqBody, ReqQuery>
) => {
  return async (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response<ResBody>, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch(next)
    // try {
    //   await func(req, res, next)
    // } catch (error) {
    //   next(error)
    // }
  }
}
