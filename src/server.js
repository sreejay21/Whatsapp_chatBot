const app = require("./app");
const { env } = require("./config/env");

app.listen(env.port, () => {
  console.log(`WhatsApp API running on port ${env.port}`);
});
