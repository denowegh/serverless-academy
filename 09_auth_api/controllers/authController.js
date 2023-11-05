const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_ACCESS_TOKEN_SECRET_KEY =
  process.env.JWT_ACCESS_TOKEN_SECRET_KEY.trim();
const JWT_REFRESH_TOKEN_SECRET_KEY =
  process.env.JWT_REFRESH_TOKEN_SECRET_KEY.trim();
const ACCESS_TOKEN_TTL_MINUTES = process.env.ACCESS_TOKEN_TTL_MINUTES.trim();
const GEN_SALT_ROUNDS = 10;

class AuthController {
  async signUp(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        throw new Error("Invalid or malformed JSON was provided");

      const salt = await bcrypt.genSalt(GEN_SALT_ROUNDS);

      const pool = new Pool({
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE,
      });

      const userSearchResult = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (userSearchResult.rowCount)
        throw new Error("email is already registered");

      const hashedPassword = await bcrypt.hash(password, salt);

      await pool.query("INSERT INTO users (email, password) VALUES ($1, $2);", [
        email,
        hashedPassword,
      ]);

      const userCreateResult = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      const userId = userCreateResult.rows[0].id;

      const accessToken = jwt.sign(
        { email, userId },
        JWT_ACCESS_TOKEN_SECRET_KEY,
        {
          expiresIn: `${ACCESS_TOKEN_TTL_MINUTES}m`,
        }
      );

      const refreshToken = jwt.sign(
        { email, userId },
        JWT_REFRESH_TOKEN_SECRET_KEY
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
      });
      return res.status(201).json({
        success: true,
        data: {
          id: userId,
          accessToken,
          refreshToken,
        },
      });
    } catch (e) {
      if (e.message == "Invalid or malformed JSON was provided")
        return res.status(502).json({ error: e.message });

      if (e.message == "email is already registered")
        return res.status(409).json({
          success: false,
          error: e.message,
        });
    }
  }
  async signIn(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        throw new Error("Invalid or malformed JSON was provided");

      const salt = await bcrypt.genSalt(GEN_SALT_ROUNDS);

      const pool = new Pool({
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE,
      });

      const userSearchResult = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      if (userSearchResult.rows[0]) {
        const {
          id: userId,
          email,
          password: passwordHash,
        } = userSearchResult.rows[0];

        const isPasswordMatch = await bcrypt.compare(password, passwordHash);

        if (isPasswordMatch) {
          const accessToken = jwt.sign(
            { email, userId },
            JWT_ACCESS_TOKEN_SECRET_KEY,
            {
              expiresIn: `${ACCESS_TOKEN_TTL_MINUTES}m`,
            }
          );

          const refreshToken = jwt.sign(
            { email, userId },
            JWT_REFRESH_TOKEN_SECRET_KEY
          );

          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
          });

          return res.status(200).json({
            success: true,
            data: {
              id: userId,
              accessToken,
              refreshToken,
            },
          });
        } else {
          throw new Error("Invalid email or password");
        }
      }
      throw new Error("Not Found");
    } catch (e) {
      if (e.message == "Invalid or malformed JSON was provided")
        return res.status(502).json({ error: e.message });

      if (e.message == "Not Found")
        return res.status(404).json({ success: false, error: e.message });

      if (e.message == "Invalid email or password")
        return res.status(502).json({ error: e.message });
    }
  }
}

module.exports = new AuthController();
