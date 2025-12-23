const express = require("express");
const whatsappRoutes = require("./src/routes/whatsapp.routes");
const whatsappWebhookRoutes = require("./src/routes/whatsappWebhook.route");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome" });
});

app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/whatsapp/webhook", whatsappWebhookRoutes);

module.exports = app;
