const { body } = require("express-validator");


const createGroupValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Group name is required"),

  body("members")
    .notEmpty()
    .withMessage("Member object is required")
    .custom((value) => {
      if (typeof value === "string") {
        try {
          value = JSON.parse(value);
        } catch (err) {
          throw new Error("Members must be a valid JSON object");
        }
      }


      if (typeof value !== "object" || Array.isArray(value)) {
        throw new Error("Members must be an object");
      }

      const requiredFields = ["userId", "name", "source"];
      for (const field of requiredFields) {
        if (!value[field]) {
          throw new Error(`members.${field} is required`);
        }
      }

      if (!["WHATSAPP", "TELEGRAM", "SLACK"].includes(value.source)) {
        throw new Error("Invalid source value");
      }

      return true;
    }),
];

module.exports = createGroupValidator;


module.exports = { createGroupValidator };
