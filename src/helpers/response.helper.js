// API Response Helper Service

function Ok (msh, res) {
  res.status(200).send({ status: true, responsecode: 200, result: msh })
}

function successCreate (result, res) {
  res.status(201).send({ status: true, responsecode: 201, result })
}

function accepted (result, res) {
  res.status(202).send({ status: true, responsecode: 202, result })
}

function noContent (res) {
  res.status(204).send({ status: true, responsecode: 204, result: null })
}

function badRequest (res) {
  res.status(400).send({ status: false, responsecode: 400, error: 'Bad request' })
}

function unAuthorized (res) {
  res.status(401).send({ status: false, responsecode: 401, error: 'Unauthorized' })
}

function forbidden (res) {
  res.status(403).send({ status: false, responsecode: 403, error: 'Forbidden' })
}

function notFound (res) {
  res.status(404).send({ status: false, responsecode: 404, error: 'Request not found' })
}

function internalServerError (res, error) {
  res.status(500).send({ status: false, responsecode: 500, error })
}

function getErrorResult (errResp, res) {
  res.status(400).send({ status: false, responsecode: 400, message: errResp })
}

function getValidationError (res, error) {
  res.status(400).send({ status: false, responsecode: 400, error })
}

module.exports = {
  Ok,
  successCreate,
  accepted,
  noContent,
  badRequest,
  unAuthorized,
  forbidden,
  notFound,
  internalServerError,
  getErrorResult,
  getValidationError
}
