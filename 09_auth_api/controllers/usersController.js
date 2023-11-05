const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class UsersController {
  async getMe(req, res) {
    const user = req.user;
    if (user)
      return res.json({
        success: true,
        data: {
          id: user.userId,
          email: user.email,
        },
      });
  }
}

module.exports = new UsersController();
