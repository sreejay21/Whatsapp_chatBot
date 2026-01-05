const { body } = require("express-validator");

const createGroupValidator = [
  body("name").trim().notEmpty().withMessage("Group name is required"),

  body("members").notEmpty().withMessage("Members is required"),

  body("createdBy")
    .notEmpty()
    .withMessage("createdBy (encrypted user id) is required"),
];

module.exports = { createGroupValidator };
