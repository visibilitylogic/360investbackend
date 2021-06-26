const _ = require("lodash");
const Registration = require("../model/Registration");
const Verify = require("../model/Verify");
const Site = require("../model/Site");

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const { cloudinary } = require("../utils/cloudinary");
const EmailNotification = require("../utils/nodeMailer");
const app = express();

app.post("/", async (req, res) => {
  const site = await Site.findById("60d6d9f151f2374e57c234ad");
  const { error } = req.body;
  const {
    name,
    email,
    wallet,
    currency,
    language,
    typeChart,
    password,
    repeatPassword,
    img,
    lastname,
    country,
    phoneNumber
  } = req.body;

  if (
    name ||
    email ||
    wallet ||
    currency ||
    language ||
    typeChart ||
    password ||
    repeatPassword ||
    img
  ) {
    console.log(name, email, password);
    if (error) return res.status(400).send(error);

    const checkEmail = await Registration.findOne({ email });
    if (checkEmail) return res.status(400).json({error:"Email already exist."});

    const wallet = 0;
    const notify = [];

    const currency = "USD";
    const language = "English";
    const typeChart = "default";
    const verify = false;

    const isManager = false;
    const isAdmin = false;

    const img = "";
    if (password.length < 8 ) {
      return  res.status(400).json({error:"Password must be greater than 8 "});     
    } 

    if (password == repeatPassword) {
      const Salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(password, Salt);

      const newRegistration = new Registration({
        name,
        lastname,
        country,
        phoneNumber,
        email,
        wallet,
        currency,
        language,
        typeChart,
        newPassword,
        verify,
        img,
        notify,
        isAdmin,
        isManager,
      });
     
      if (site&& site.sendWelcomeMail) {
        EmailNotification(
          email,
          `<div>
          <div style=" margin: auto;
          width: 60%;
          padding: 10px;"><img width="100" src="${site.siteLogo}" alt="Logo"/></div>
          <p>Hi ${name} <br> ${site.welcomeMail}</p>
          
          </div>`,
          site.newUserWelcomeMailTitle!==""?site.newUserWelcomeMailTitle:"Registration was successful"
        );
      }
      await newRegistration.save();
      res.status(200).json(newRegistration)

     
    } else {
      return  res.status(400).json({error:"Password must be the same"});
    }

  

  } else {
    const error="fill all details";
    return res.status(200).send(error);
  }
});

app.post("/file/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    console.log(_id);
    let { img, name, number } = req.body;

    const fileStr = img;
    const uploadResponse = await cloudinary.uploader.upload(fileStr);
    img = uploadResponse.secure_url;

    const updatedAt = new Date();
    const data = await Registration.findOneAndUpdate(
      { _id },
      { img },
      { new: true }
    );

    const data2 = await Registration.findOneAndUpdate(
      { _id },
      { verify: true },
      { new: true }
    );
    Registration.findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          notify: { des: `Your account has been VERIFIED `, topic: "Verified" },
        },
      },
      { new: true },
      function (err, result) {
        if (err) {
          console.log(err);
        }
      }
    );
    const newId = new Verify({
      name,
      number,
      img,
    });
    await newId.save();

    res.send(
      _.pick(newId, [
        "_id",
        "name",
        "time",
        "email",
        "wallet",
        "currency",
        "language",
        "typeChart",
        "verify",
        "img",
      ])
    );

    console.log(data, data2);
  } catch (err) {
    console.log(err);
  }
});

app.post("/logo", async (req, res) => {
  try {
    let { siteLogo } = req.body;
    const fileStr = siteLogo;
    const uploadResponse = await cloudinary.uploader.upload(fileStr);
    siteLogo = uploadResponse.secure_url;
    const data = await Site.findOneAndUpdate(
      { _id: "60d6d9f151f2374e57c234ad" },
      { siteLogo },
      { new: true }
    );
    console.log(data);
  } catch (err) {
    console.log(err);
  }
});

app.post("/fav", async (req, res) => {
  console.log("favvv");
  try {
    let { siteFav } = req.body;
    const fileStr = siteFav;
    const uploadResponse = await cloudinary.uploader.upload(fileStr);
    siteFav = uploadResponse.secure_url;
    const data = await Site.findOneAndUpdate(
      { _id: "60d6d9f151f2374e57c234ad" },
      { siteFav },
      { new: true }
    );
    console.log(data);
  } catch (err) {
    console.log(err);
  }
});

app.post("/title", async (req, res) => {
  console.log("favvv");
  try {
    let { siteTitle } = req.body;

    const data = await Site.findOneAndUpdate(
      { _id: "60d6d9f151f2374e57c234ad" },
      { siteTitle },
      { new: true }
    );
    console.log(data);
  } catch (err) {
    console.log(err);
  }
});

app.get("/site", async (req, res) => {
  const site = await Site.find({});
  res.send(site);
});

module.exports = app;
