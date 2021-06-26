const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use((req, res, next) => {
  console.log("Here now")
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-reqed-With");
  res.header("Access-Control-Allow-Methods", "PATCH,POST,GET,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

// const cors = require("cors");

// app.use(cors());

const registration = require("./app/registration");
const Trade = require("./model/Trade");
const Deposit = require("./model/Deposit");
const Withdraw = require("./model/Withdraw");
const Verify = require("./model/Verify");

const History = require("./model/History");
const Registration = require("./model/Registration");

const login = require("./app/login");
const db = require("./config/db");
const profile = require("./app/profile");
const trade = require("./app/trade");
const site = require("./app/site");
const password = require("./app/password");
const verify = require("./app/verification");
const users = require("./app/users");
const withdraw = require("./app/withdrawal");
const deposit = require("./app/deposit");
const copytrade = require("./app/copyTradeSubscription");
const autocopytrade = require("./app/autoCopyTrade");

//favicon
// Mixed Content: The page at 'https://www.prolivetrader.app/dashboard' was loaded over HTTPS, but requested an insecure favicon 'http://res.cloudinary.com/code-idea/image/upload/v1620612629/h2nmirybjahltuyxfesi.png'. This request has been blocked; the content must be served over HTTPS.

// Express body parser
app.use(express.urlencoded({ limit: "1000000000000000000mb", extended: true }));
app.use(express.json({ limit: "1000000000000000000mb", extended: true }));

mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));
app.use("/api/registration", registration);
app.use("/api/login", login);
app.use("/api/profile", profile);
app.use("/api/trade", trade);
app.use("/api/site", site);
app.use("/api/password", password);
app.use("/api/verify", verify);
app.use("/api/users", users);
app.use("/api/withdraw", withdraw);
app.use("/api/deposit", deposit);
app.use("/api/copytrade", copytrade);
app.use("/api/autocopytrade", autocopytrade);
app.get("/", async (req, res) => {
  res.json({ msg: "working" });
});

app.get("/allUser", async (req, res) => {
  const user = await Registration.find({});
  res.send(user);
});

// @desc    Get all users verified users
// @route   GET /allVerify
//@access Admin and Manager
app.get("/allVerify", async (req, res) => {
  const users = await Registration.find({});
  const verifiedUser = users.filter((e) => e.verify);
  res.status(200).send(verifiedUser);
});

app.get("/allWithdraw", async (req, res) => {
  const withdraw = await Withdraw.find({});

  res.send(withdraw);
});

app.get("/allTrade", async (req, res) => {
  const trade = await History.find({});

  res.send(trade);
});

app.get("/allDeposit", async (req, res) => {
  const deposit = await Deposit.find({});

  res.send(deposit);
});

// @desc    Get all users bank details
// @route   GET /allBankDetails
//@access Admin and Manager
app.get("/allBankDetails", async (req, res) => {
  const users = await Registration.find({});

  res.send(users.map((e) => e.bankDetails));
});
// @desc    Get all users cryptocurrency details
// @route   GET /allBankDetails
//@access Admin and Manager
app.get("/allCryptocurrencyDetails", async (req, res) => {
  const users = await Registration.find({});

  res.send(users.map((e) => e.cryptocurrencyWallet));
});

const PORT = process.env.PORT || 2800;

app.set("port", PORT);

app.listen(PORT, () => {
  console.log("Listening to " + PORT);
});
