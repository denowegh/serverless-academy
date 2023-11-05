const jwt = require("jsonwebtoken");

const JWT_ACCESS_TOKEN_SECRET_KEY =
  process.env.JWT_ACCESS_TOKEN_SECRET_KEY.trim();
const JWT_REFRESH_TOKEN_SECRET_KEY =
  process.env.JWT_REFRESH_TOKEN_SECRET_KEY.trim();

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken == null) return res.sendStatus(401);

    jwt.verify(refreshToken, JWT_REFRESH_TOKEN_SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken = generateAccessToken({ name: user.name });
      req.user = user;
      req.newAccessToken = accessToken;
      next();
    });
  } else {
    jwt.verify(token, JWT_ACCESS_TOKEN_SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  }
}

module.exports = authenticateToken;
