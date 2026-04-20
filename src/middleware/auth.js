const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.decode(token); 

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = authenticate;