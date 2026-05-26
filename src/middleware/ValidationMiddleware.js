const {
  validationResult
} = require('express-validator')

const response =
require(
  '../helpers/response.helper'
)

const validate = (
  req,
  res,
  next
) => {

  const errors =
    validationResult(req)

  if (!errors.isEmpty()) {

    return response
      .getValidationError(
        res,
        errors.array()[0].msg
      )
  }

  next()
}

module.exports = validate