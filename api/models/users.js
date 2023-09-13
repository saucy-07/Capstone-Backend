const db = require("../config");
const { hash, compare } = require("bcrypt");
const { createToken } = require("../middleware/authenticateUser");
const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const app = express();
app.use(cookieParser());
class Users {
  fetchUsers(req, res) {
    const query = `
        SELECT userID, firstName, lastName, gender, userRole, emailAddress, profileUrl, userPass
        FROM Users;`;
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json({
        status: res.statusCode,
        results,
      });
    });
  }
  fetchUser(req, res) {
    const query = `
        SELECT userID, firstName, lastName, gender, userRole, emailAddress, profileUrl, userPass
        FROM Users
        WHERE userID = ${req.params.id};`;
    db.query(query, (err, result) => {
      if (err) throw err;
      res.json({
        status: res.statusCode,
        result,
      });
    });
  }
  async register(req, res) {
    const data = req.body;
    try {
      const saltRounds = 15;
      const hashedPassword = await bcrypt.hash(data.userPass, saltRounds);
      const user = {
        firstName: data.firstName,
        lastName: data.lastName,
        userRole: data.userRole,
        emailAddress: data.emailAddress,
        userPass: hashedPassword,
      };
      const query = "INSERT INTO Users SET ?";
      db.query(query, user, (err, results) => {
        if (err) {
          console.error("Error inserting user:", err);
          res.status(500).json({ error: "Internal server error" });
        } else {
          const token = jwt.sign(
            { userID: results.insertId, emailAdd: user.emailAdd },
            process.env.secret_key,
            {
              expiresIn: "1h",
            }
          );
          res.cookie("AuthorizedUser", token, {
            maxAge: 3600000,
            httpOnly: true,
          });
          res.status(201).json({
            status: res.statusCode,
            message: "New user registered!",
          });
        }
      });
    } catch (error) {
      console.error("Error hashing password:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async login(req, res) {
    const { emailAddress, userPass } = req.body;
    const query = `
    SELECT userID, firstName, lastName, userRole, emailAddress, userPass
    FROM Users
    WHERE emailAddress = '${emailAddress}';
  `;
    db.query(query, async (err, results) => {
      if (err) throw err;
      if (!results?.length) {
        res.json({
          status: res.statusCode,
          msg: "You provided a wrong email.",
        });
      } else {
        const user = results[0];
        await compare(userPass, user.userPass, (cErr, cResults) => {
          if (cErr) throw cErr;
          if (cResults) {
            const token = createToken({
              emailAddress,
              userPass,
            });
            res.json({
              msg: "Welcome to The Danger Noodle",
              token,
              results: user,
            });
          } else {
            res.json({
              status: res.statusCode,
              msg: "Invalid password or you have not registered",
            });
          }
        });
      }
    });
  }
  async updateUser(req, res) {
    const query = `
        UPDATE Users
        SET ?
        WHERE userID = ?`;
    const data = req.body;
    // encrypt password
    data.userPass = await bcrypt.hash(data.userPass, 20);
    db.query(query, [data, req.params.id], (err) => {
      if (err) throw err;
      res.json({
        status: res.statusCode,
        message: "Updated User Details",
      });
    });
  }
  deleteUser(req, res) {
    const query = `
        DELETE FROM Users
        WHERE userID = '${req.params.id}';`;
    db.query(query, (err) => {
      if (err) throw err;
      res.json({
        status: res.statusCode,
        message: "Deleted User",
      });
    });
  }
}
module.exports = Users;
