const jwt = require("jsonwebtoken");
const _ = require("lodash");
const Registration = require("../model/Registration");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();

// @desc    Forgot password link
// @route   POST /api/login
app.post("/", async (req, res) => {
  const { error } = req.body;
  const { email, password } = req.body;
  console.log("userrrr");

  if (email || password) {
    console.log(email, password);
    const user = await Registration.findOne({ email });
    if (user) {
      const validpassword = await bcrypt.compare(password, user.newPassword);

      console.log(validpassword);

      if (validpassword) {
        const token = jwt.sign({ _id: user.email }, "jwtPrivateKey");
        res.send({
          user,
          token,
        });
        user.time=new Date()
       await user.save()
      } else {
        return res.json({ error: "Invalid Password" });
      }
    } else {
      return res.json({ error: "we don't have this email in our database" });
    }
  } else {
    return res.json({ error: "fill the form" });
  }
});

module.exports = app;
