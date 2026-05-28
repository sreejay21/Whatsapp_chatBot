const User = require('../models/user.model')

const findByExternalUserIdAndType = async (
  externalUserId,
  userType
) => {
  return await User.findOne({
    externalUserId,
    userType,
    isDeleted: false
  })
}

const createUser = async (payload) => {
  return await User.create(payload)
}

const findByPhoneAndUserType = async (
  phone,
  userType
) => {
  return await User.findOne({
    phone,
    userType,
    isDeleted: false
  })
}

const updateUser = async (userId, updateData) => {
  return await User.findByIdAndUpdate(
    userId,
    updateData,
    { new: true }
  )
}

const findById = async (userId) => {
  return await User.findOne({
    externalUserId: userId,
    isDeleted: false
  })
}

module.exports = {
  findByExternalUserIdAndType,
  createUser,
  findByPhoneAndUserType,
  findById,
  updateUser
}