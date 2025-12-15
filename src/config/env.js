const dotenv = require("dotenv");
dotenv.config();

const env = {
  port: process.env.PORT,
  accessToken: process.env.ACCESS_TOKEN,
  phoneNumberId: process.env.PHONE_NUMBER_ID,
  verifyToken: process.env.VERIFY_TOKEN,
};

module.exports = { env };
