import { validate } from '~/utils/validation'
import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import usersService from '~/services/users.services'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' })
  }

  // Add more validation logic as needed
  next()
}

export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: { min: 1, max: 100 }
      },
      trim: true
    },
    email: {
      isEmail: true,
      normalizeEmail: true,
      notEmpty: true,
      trim: true,
      custom: {
        options: async (value: string) => {
          const isExitEmail = await usersService.checkEmailService(value)
          if (isExitEmail) {
            throw new Error('Email already exists')
          }

          return value
        }
      }
    },
    password: {
      isString: true,
      isLength: {
        options: { min: 6, max: 50 }
      },
      notEmpty: true,
      trim: true,
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 0,
          minUppercase: 0,
          minNumbers: 0,
          minSymbols: 0
        },
        errorMessage:
          'Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, and one number'
      }
    },
    confirm_password: {
      isString: true,
      isLength: {
        options: { min: 6, max: 50 }
      },
      notEmpty: true,
      trim: true,
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage:
          'Confirm password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, and one number'
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Confirm password does not match password')
          }
          return true
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: { strict: true, strictSeparator: true }
      },
      notEmpty: true
    }
  })
)
