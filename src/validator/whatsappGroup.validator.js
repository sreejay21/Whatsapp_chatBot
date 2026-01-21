const { body } = require("express-validator");


const createGroupValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Group name is required"),

  body("members")
    .notEmpty()
    .withMessage("Members is required")
    .custom((value, { req }) => {
      if (typeof value === "string") {
        try {
          value = JSON.parse(value);
        } catch {
          throw new Error("Members must be valid JSON");
        }
      }

      const members = Array.isArray(value) ? value : [value];

      if (!members.length) {
        throw new Error("At least one member is required");
      }

      members.forEach((member, index) => {
        if (typeof member !== "object") {
          throw new Error(`members[${index}] must be an object`);
        }

        if (!member.externalUserId && !member.userId) {
          throw new Error(
            `members[${index}].externalUserId is required`
          );
        }

        if (!member.name) {
          throw new Error(`members[${index}].name is required`);
        }

        if (!member.source) {
          throw new Error(`members[${index}].source is required`);
        }

        const source = member.source.toUpperCase();
        if (!["WHATSAPP", "TELEGRAM", "SLACK"].includes(source)) {
          throw new Error(
            `members[${index}].source must be WHATSAPP, TELEGRAM, or SLACK`
          );
        }

        member.source = source;
        member.externalUserId =
          member.externalUserId || member.userId;
      });

      req.body.members = members;

      return true;
    }),
];
module.exports = { createGroupValidator };
