const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const setupSwagger = (app) => {
  // Swagger UI route
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Raw Swagger JSON
  app.get("/api-docs/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};

module.exports = setupSwagger;
