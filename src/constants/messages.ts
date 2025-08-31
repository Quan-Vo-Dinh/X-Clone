export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_BETWEEN_1_AND_100: 'Name length must be between 1 and 100',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_VALID: 'Email is valid',  
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_STRING: 'Password must be a string',
  PASSWORD_LENGTH_MUST_BE_BETWEEN_6_AND_50: 'Password length must be between 6 and 50',
  PASSWORD_MUST_BE_STRONG: 'Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_BETWEEN_6_AND_50: 'Confirm password length must be between 6 and 50',
  PASSWORDS_DO_NOT_MATCH: 'Confirm password does not match password',
  DATE_OF_BIRTH_MUST_BE_ISO8601: 'Date of birth must be in ISO 8601 format',
  DATE_OF_BIRTH_IS_REQUIRED: 'Date of birth is required'
} as const
