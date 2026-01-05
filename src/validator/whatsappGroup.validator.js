const { body } = require("express-validator");

const createGroupValidator = [
  body("name").trim().notEmpty().withMessage("Group name is required"),

  body("members")
    .notEmpty()
    .withMessage("Members is required")
    .custom((value) => {
      if (typeof value === "string") {
        try {
          value = JSON.parse(value);
        } catch (err) {
          throw new Error("Members must be array");
        }
      }

      if (!Array.isArray(value)) {
        throw new Error("Members must be an array");
      }

      if (value.length === 0) {
        throw new Error("Members array cannot be empty");
      }

      return true;
    }),
];

module.exports = { createGroupValidator };
