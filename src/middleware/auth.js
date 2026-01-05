const jwt = require("jsonwebtoken");

const TOKEN =
  "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI2OGFlYmFkYmVjOTVkMDY1ZGQ3NjgxMzMiLCJ1bmlxdWVfbmFtZSI6IlNhbm9vaiBNIFUiLCJnaXZlbl9uYW1lIjoiU2Fub29qIiwiZmFtaWx5X25hbWUiOiJNIFUiLCJlbWFpbCI6InNhbm9vai5tQHplcm9uZS1jb25zdWx0aW5nLmNvbSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3VyaSI6Inplcm9uZSIsInJvbGUiOiIiLCJwcmltYXJ5Z3JvdXBzaWQiOiJodHRwczovL3JpdHJvLWt2LWNhdGFsb2ctZGV2LnZhdWx0LmF6dXJlLm5ldC8iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9zcG4iOiJ6ZXJvbmUtcml0cm8ta3YtemVyb25lLWRldiIsImdyb3Vwc2lkIjoiQ2xpZW50QWRtaW4iLCJwcmltYXJ5c2lkIjoiNjk1M2VhN2U5MDMxN2Y3Mzg4Y2IxYjkwIiwibmJmIjoxNzY3NjEzODA0LCJleHAiOjE3Njc2MTc0MDQsImlhdCI6MTc2NzYxMzgwNCwiaXNzIjoiaHR0cHM6Ly9yaXRyb2FwaWRldi5henVyZXdlYnNpdGVzLm5ldCIsImF1ZCI6Imh0dHBzOi8vcml0cm9kZXYuYXp1cmV3ZWJzaXRlcy5uZXQifQ.dNmj883RGLkNCJ_Dnpc8GMCaodwATEtQDobQoWvHvOMrKdz11aDvedjiQSEmMVLnnbdnNlesAuBko1dqNpnDiw";

const authenticate = (req, res, next) => {
  try {
    const payload = jwt.decode(TOKEN);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

module.exports = authenticate;
