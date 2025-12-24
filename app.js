const express = require("express");
const whatsappRoutes = require("./src/routes/whatsapp.routes");
const whatsappWebhookRoutes = require("./src/routes/whatsappWebhook.route");
const whatsappUserRoutes = require("./src/routes/whatsappUser.routes");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome" });
});

app.use("/api/whatsapp", whatsappRoutes);
app.use("/webhook", whatsappWebhookRoutes);
app.use("/api/whatsapp-users", whatsappUserRoutes);

module.exports = app;
