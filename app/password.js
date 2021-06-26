const lodash = require("lodash");
const JWT = require("jsonwebtoken");
const User = require("../model/Registration");
const SiteInfo = require("../model/Site");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const EmailNotification = require("../utils/nodeMailer");

// @desc    Forgot password link
// @route   PUT /api/password/forgot
app.put("/forgot", async (req, res) => {
  const site = await SiteInfo.findById("60d6d9f151f2374e57c234ad");

  const { email } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "user with this email does not exist",
      });
    }

    const token = JWT.sign({ id: user._id, email }, "jwtPrivateKey", {
      expiresIn: "50m",
    });

    return user.updateOne({ reset_token: token }, async (err, success) => {
      if (err) {
        return res.status(400).json({ error: "reset password error" });
      } else {
        if (site) {
          user.save();
          EmailNotification(
            user.email,

            `<div>
            <div style=" margin: auto;
            width: 60%;
            padding: 10px;"><img width="100" src="${site.siteLogo}" alt="Logo"/></div>
            <p>${site.userResetPasswordMail}Your reset password token is ${token}</p>
            </div>
          `,
            ` <h2>Reset Password Mail</h2>`
          );
        }
        console.log(token);
        return res
          .status(200)
          .json({ message: "Email has been sent, kindy reset password" });
      }
    });
  });
});

// @desc    Reset password
// @route   PUT /api/password/reset
app.put("/reset", async (req, res) => {
  const site = await SiteInfo.findById("60d6d9f151f2374e57c234ad");
  const { reset_token, newPassword } = req.body;
  if (reset_token) {
    JWT.verify(reset_token, "jwtPrivateKey", (err, decodedData) => {
      if (err) {
        res.status(401).json({
          error: "Incorrect or expired token",
        });
      }
      User.findOne({ _id: decodedData.id, reset_token }, async (err, user) => {
        if (err || !user) {
          return res
            .status(400)
            .json({ error: "user with this token does not exist " });
        }

        const Salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(newPassword, Salt);

        const obj = {
          newPassword: password,
          reset_token: "",
        };
        user = lodash.extend(user, obj);

        user.save((err, result) => {
          if (err) {
            return res.status(400).json({ error: err });
          } else if (result && site) {
            EmailNotification(
              user.email,

              `<div>
              <div style=" margin: auto;
              width: 60%;
              padding: 10px;"><img width="100" src="${site.siteLogo}" alt="Logo"/></div>
              <p>Hi ${user.name}<br> ${site.userSubscriptionEExpirationMail}</p></div>
              `,
              ` <h2>Password Reset Comfirmation</h2>`
            );
            return res
              .status(200)
              .json({ message: "Password reset was successfull" });
          }
        });
      });
    });
  } else {
    return res.status(400).json({ error: "Invalid request" });
  }
});

module.exports = app;
