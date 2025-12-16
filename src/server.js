const app = require("./app");
const { env } = require("./config/env");
const connectDB = require("./config/db");


connectDB()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`WhatsApp API running on port ${env.port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
