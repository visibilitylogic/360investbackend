const _ = require("lodash");
const Trade = require("../model/Trade");
const Deposit = require("../model/Deposit");
const Withdraw = require("../model/Withdraw");
const Verify = require("../model/Verify");

const History = require("../model/History");
const mongoose = require("mongoose");
const Registration = require("../model/Registration");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();

app.post("/:id", async (req, res) => {
  const { error } = req.body;
  let { tag, stockName, stockAmount, buyW, unit, loss, profit } = req.body;
  console.log(unit)

  if (tag || stockName || stockAmount || buyW) {
    const user = await Registration.findOne({ _id: req.params.id });

    if (error) return res.status(400).send(error);
    const active = true;
    if (!loss || !profit) {
      loss = "loss";
      profit = "profit";
    }

    console.log(loss, profit, "iss", stockAmount * buyW);
    userId = req.params.id;

    Registration.findOneAndUpdate(
      { _id: user._id },
      {
        $set: { wallet: parseInt(user.wallet) - parseInt(stockAmount * buyW) },
      },
      { new: true },
      function (err, result) {
        if (err) {
          console.log(err);
        }
      }
    );

    Registration.findOneAndUpdate(
      { _id: user._id },
      {
        $push: { notify:  {des: `Did a ${tag} of ${stockName} for ${stockAmount}`, topic:'Trade'}   },
      },
      { new: true }, 
      function (err, result) {
        if (err) {
          console.log(err);
        }
      }
    );

    const newTrade = new Trade({
      tag,
      stockName,
      stockAmount,
      profit,
      loss,
      active,
      buyW,
      unit,
      userId,
    });

    const newHis = new History({
      tag,
      stockName,
      stockAmount,
      profit,
      loss,
      active,
      buyW,
      unit,
      userId,
    });
    await newTrade.save();
    await newHis.save();

    res.send(
      _.pick(newTrade, [
        "_id",
        "tag",
        "stockName",
        "stockAmount",
        "profit",
        "loss",
        "active",
        "buyW",
        "unit",
        "time",
      ])
    );
  } else {
    return res.status(200).send("fill all inputs");
  }
});

app.post("/deposit/:id", async (req, res) => {
  const { error } = req.body;
  let userId = req.params.id;
  let { cardCvv, cardMonth, cardName, cardNumber, cardYear, amount } = req.body;
  console.log('issss')

  if (cardCvv || cardMonth || cardYear || cardName || cardNumber || amount) {
    const newDeposit = new Deposit({
      cardCvv,
      cardMonth,
      cardName,
      cardNumber,
      cardYear,
      amount,
      userId,
    });

    await newDeposit.save();

    Registration.findOneAndUpdate(
      { _id: userId },
      {
        $push: { notify:  {des:`Deposited ${amount}`, topic:'Deposit'} },
      },
      { new: true },
      function (err, result) {
        if (err) {
          console.log(err);
        }
      }
    );

    res.send(
      _.pick(newDeposit, [
        "_id",
        "cardCvv",
        "cardMonth",
        "cardName",
        "cardNumber",
        "cardYear",
        "amount",
        "userId",
      ])
    );
  } else {
    return res.status(200).send("fill all inputs");
  }
});

app.post("/withdraw/:id", async (req, res) => {
  const { error } = req.body;
  let userId = req.params.id;
  let { amount } = req.body;
  if (amount) {
    const newWithdraw = new Withdraw({
      amount,
      userId,
    });

    Registration.findOneAndUpdate(
      { _id: userId },
      {
        $push: { notify:   {des:`Withdraw ${amount}`, topic:'Withdraw'} },
      },
      { new: true },
      function (err, result) {
        if (err) {
          console.log(err);
        }
      }
    );
    await newWithdraw.save();

    res.send(_.pick(newWithdraw, ["_id", "amount", "userId"]));
  } else {
    return res.status(200).send("fill all inputs");
  }
});

app.post("/userWallet/:id", async (req, res) => {
  const user = await Registration.findOne({ _id: req.params.id });
  const { error } = req.body;
  let userId = req.params.id;

  let { amount } = req.body;

  console.log('resch',typeof(amount),amount)

  if (amount) {
    Registration.findOneAndUpdate(
      { _id: userId },
      {
        $push: { notify:  {des:`wallet Funded with ${amount}`, topic:'Wallet Fund'} },
      },
      { new: true },
      function (err, result) {
        console.log(result);

        if (err) {
          console.log(err);
        }
      }
    );

    Registration.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          wallet: parseInt(user.wallet) + parseInt(amount),
        },
      },
      { new: true },
      function (err, result) {
        console.log(result);

        if (err) {
          console.log(err);

        }
      }
    );
    res.send({ amount });

  } else {
    return res.status(200).send("fill all inputs");
  }
});

// alll get API

app.get("/:id", async (req, res) => {
  const trade = await Trade.find({ userId: req.params.id });
  res.send(trade);
});



app.get("/desposit/:id", async (req, res) => {
  const deposit = await Deposit.find({ userId: req.params.id });
  res.send(deposit);
});


app.get("/withdraw/:id", async (req, res) => {
  const withdraw = await Withdraw.find({ userId: req.params.id });
  res.send(withdraw);
});


app.get("/del/:id", async (req, res) => {
  Trade.findOne({ _id: req.params.id }, function (error, trade) {
    trade.remove();
  });
});
 
app.get("/his/:id", async (req, res) => {
  const trade = await History.find({ userId: req.params.id });
  res.send(trade);
});

app.get("/user/:id", async (req, res) => {
  const user = await Registration.findOne({ _id: req.params.id });
  res.json({
    user: { user: user },
  });
});



app.get("/close/:id/:amount/:newAmount", async (req, res) => {
  const trade = await Trade.findOne({ _id: req.params.id });
  const user = await Registration.findOne({ _id: trade.userId });
  console.log(trade.tag, req.params.amount, "needed", req.params.newAmount);

  if (trade.tag === "buy") {
    if (req.params.amount > req.params.newAmount) {
      console.log(
        trade.tag,
        req.params.amount,
        "add buy",
        req.params.newAmount
      );

      Registration.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            wallet: parseInt(user.wallet) + parseInt(req.params.newAmount),
          },
        },
        { new: true },
        function (err, result) {
          if (err) {
            console.log(err);
          }
        }
      );
    } else {
      console.log(
        trade.tag,
        req.params.amount,
        "remove buy",
        req.params.newAmount
      );
      console.log( req.params.amount, "needed", req.params.newAmount);

      let result = 0
      if (user.wallet > req.params.newAmount){
        result = parseInt(user.wallet) - parseInt(req.params.amount)

      }else{
        result = 0
      }


      Registration.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            wallet:result,
          },
        },
        { new: true },
        function (err, result) {
          if (err) {
            console.log(err);
          }
        }
      );
    }
  } else {
    if (req.params.amount > req.params.amount) {
      console.log(
        trade.tag,
        req.params.amount,
        "Remove sell",
        req.params.newAmount
      );
      console.log( req.params.amount, "needed", req.params.newAmount);

      let result = 0
      if (user.wallet > req.params.amount){
        result = parseInt(user.wallet) - parseInt(req.params.amount)

      }else{
        result = 0
      }

      Registration.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            wallet: result,
          },
        },
        { new: true },
        function (err, result) {
          if (err) {
            console.log(err);
          }
        }
      );
    } else {
      console.log(
        trade.tag,
        req.params.amount,
        "add sell",
        req.params.newAmount
      );

      Registration.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            wallet: parseInt(user.wallet) + parseInt(req.params.newAmount),
          },
        },
        { new: true },
        function (err, result) {
          if (err) {
            console.log(err);
          }
        }
      );
    }
  }

  Trade.findOneAndUpdate(
    { _id: trade._id },
    {
      $set: { active: false },
    },
    { new: true },
    function (err, result) {
      if (err) {
        console.log(err);
      }
    }
  );

  Registration.findOneAndUpdate(
    { _id: user._id },
    {
      $push: { notify:   {des:`closed a trade `, topic:'Trade'} },
    },
    { new: true },
    function (err, result) {
      if (err) {
        console.log(err);
      }
    }
  );
});

module.exports = app;
