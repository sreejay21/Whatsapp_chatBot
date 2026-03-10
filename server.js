require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const setupSwagger = require("./src/swagger/swagger.middleware"); // Swagger middleware

const PORT = process.env.PORT || 5000;

// Mount Swagger before starting the server
setupSwagger(app);

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
