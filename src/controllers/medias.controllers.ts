import { NextFunction, Request, Response } from 'express'
import formidable from 'formidable'
import { HTTP_STATUS } from '~/constants/httpStatus'
import path from 'path'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  const form = formidable({
    uploadDir: path.resolve('uploads'), // path là đường dẫn tuyệt đối đến folder gốc của project
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    multiples: false
  })

  form.parse(req, (err, fields, files) => {
    if (err) {
      return next(err)
    }
    return res.status(HTTP_STATUS.OK).json({ message: 'Image uploaded successfully' })
  })
}
