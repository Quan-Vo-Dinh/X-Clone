import { NextFunction, Request, Response } from 'express'
import { omit } from 'lodash'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json(omit(err, ['status']))
  }
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  })

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    error_info: omit(err, ['stack'])
  })
}

// note: 1. Error trong JS/Node mặc định không phải object phẳng

/**
các property như message, stack, name của Error là non-enumerable.
Do đó khi sử dụng JSON.stringify hoặc các phương thức tương tự để chuyển đổi Error thành JSON, các property này sẽ không được bao gồm.

console.log(Object.keys(err));       // []
console.log(err.message);            // 'Something broke'
console.log(err.stack);              // stack trace

=> 
 */
