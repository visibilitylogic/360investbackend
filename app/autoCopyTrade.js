const AutoCopyTrade = require("../model/AutoCopyTrades");
const Site = require("../model/Site");
const User = require("../model/Registration");
const EmailNotification = require("../utils/nodeMailer");

const express = require("express");
const app = express();
app.post("/email", async (req, res) => {
  const site = await Site.findById("61115addb31f2b97ae0fb873");

  EmailNotification(
    "oshiesam@gmail.com",
    `<div>
    <div style=" margin: auto;
    width: 60%;
    padding: 10px;"><img width="100" src="${site.siteLogo}" alt="Logo"/></div>
    <p>Hi ${"sam"} <br> <div>There is a new update on your Auto Copy Trader Subscription Plan On (Pro Live Trader) Platform</div><br>
        <div>You made a </div></p></div>`,
    "Auto CopyTrade Report"
  );
  res.send("sent");
});
// @desc   Create AutoCopyTrade
// @route   POST /api/autocopytrade
//@access Admin and user
app.post("/", async (req, res) => {
  const { profitLoss, market, userId, amount, scheduledTime, assets } =
    req.body;
  const user = await User.findOne({ _id: userId });
  const details = {
    profitLoss: profitLoss,
    userId: userId,
    market: market,
    currentBalance: user.wallet,
    amount: amount,
    assets: assets,
    scheduledTime: scheduledTime,
    date: new Date(),
    hasTraded: false,
  };
  // estimatedBalance:{type:Number}

  if (user) {
    const autocopytrade = new AutoCopyTrade(details);
    if (autocopytrade.profitLoss === true) {
      user.estimatedBalance = user.estimatedBalance + autocopytrade.amount;
      if (autocopytrade.scheduledTime > user.lastAutoTradeDate) {
        user.lastAutoTradeDate = autocopytrade.scheduledTime;
        // await user.save()
        console.log("lesss");
      } else if (autocopytrade.scheduledTime <= user.lastAutoTradeDate) {
        user.lastAutoTradeDate = user.lastAutoTradeDate;
        console.log("greater");
        // await user.save()
      }
      await user.save();
    } else if (autocopytrade.profitLoss === false) {
      user.estimatedBalance = user.estimatedBalance - autocopytrade.amount;
      if (autocopytrade.scheduledTime > user.lastAutoTradeDate) {
        user.lastAutoTradeDate = autocopytrade.scheduledTime;
        // await user.save()
        console.log("lesss");
      } else if (autocopytrade.scheduledTime <= user.lastAutoTradeDate) {
        user.lastAutoTradeDate = user.lastAutoTradeDate;
        // await user.save()
        console.log("greater");
      }
      await user.save();
    }
    await autocopytrade.save();

    res.json(autocopytrade);
  } else {
    res.status(400).send("user does not exist");
  }
});
// @desc   Get all autocopyTrades
// @route   GET/api/autocopytrade
//@access  Admin and Manager

app.get("/", async (req, res) => {
  const autocopytrade = await AutoCopyTrade.find({});
  res.status(200).json(autocopytrade.reverse());
});

app.get("/single/:id", async (req, res) => {
  const { id } = req.params;
  const autocopytrade = await AutoCopyTrade.findById(id);
  res.status(200).json(autocopytrade);
});

// @desc   Get specific user AutoCopyTrades befor current time
// @route   GET/api/autocopytrade
//@access  Admin and Manager

app.get("/:id", async (req, res) => {
  const autocopytrade = await AutoCopyTrade.find({ userId: req.params.id });
  const getOnlyRunningTrades = autocopytrade.filter(
    (trade) => trade.scheduledTime > new Date(new Date())
  );
  res.status(200).json(getOnlyRunningTrades.reverse());
});

// @desc   Get specific user AutoCopyTrades befor current time
// @route   GET/api/autocopytrade/user/:id
//@access  Admin and Manager

app.get("/user/:id", async (req, res) => {
  const autocopytrade = await AutoCopyTrade.find({ userId: req.params.id });
  res.status(200).json(autocopytrade.reverse());
});

//automated trade in the server site function
const Trade = async (id) => {
  const autocopytrade = await AutoCopyTrade.findById(id);
  const user = await User.findOne({
    _id: autocopytrade && autocopytrade.userId,
  });
  if(user.autoTrade===false){
    autocopytrade.hasNotTraded===true
    autocopytrade.save()
  }
  else if(user.autoTrade===true){
  if (
    autocopytrade.scheduledTime < new Date() &&
    autocopytrade.hasTraded === false
  ) {
    if (user) {
      if (autocopytrade.profitLoss === true) {
        user.wallet = user.wallet + autocopytrade.amount;
        await user.save();
      } else if (autocopytrade.profitLoss === false) {
        user.wallet = user.wallet - autocopytrade.amount;
        await user.save();
      }

      autocopytrade.hasTraded = true;
      const site = await Site.findById("61115addb31f2b97ae0fb873");
      EmailNotification(
        user.email,
        `<div>
        <div style=" margin: auto;
        width: 60%;
        padding: 10px;"><img width="100" src="${site.siteLogo}" alt="Logo"/></div>
        <p>Hi ${
          user.name
        } <br> <div>There is a new update on your Auto Copy Trader Subscription Plan On (Pro Live Trader) Platform</div><br>
            <div>You made a ${
              autocopytrade.profitLoss ? "Profit" : "Loss"
            } of $${autocopytrade.amount}<br> on the Asset ${
          autocopytrade.assets
        }<br> on ${new Date()}</div></p></div>`,
        "Auto CopyTrade Report"
      );

      await autocopytrade.save();
      // res.json(autocopytrade);
      console.log("trading..");
    } else {
      // res.status(400).send("user does not exist")
      // console.log("user does not exist")
    }
  } else {
    // res.status(400).send("Not yet  time to trade or trade has been executed already")
    //console.log("Not yet  time to trade or trade has been executed already")
  }
}
};

//trade every one minute
setInterval(async () => {
  const autocopytrade = await AutoCopyTrade.find({});
  // const trade = autocopytrade.map((trade) => trade._id);
  const hasNotTraded = autocopytrade.filter(
    (trade) => trade.hasTraded === false
  );
  const hasNotTradedID = hasNotTraded.map((trade) => trade._id);
  if (hasNotTradedID.length > 0) {
    hasNotTradedID.forEach((element) => Trade(element));
    // Trade(hasNotTradedID)
    // console.log("traded")
  } else console.log("Nothing to trade");
}, 1000);

app.put("/trade/:id", async (req, res) => {
  const autocopytrade = await AutoCopyTrade.findById(req.params.id);
  const user = await User.findOne({ _id: autocopytrade.userId });
  if (
    autocopytrade.scheduledTime < new Date() &&
    autocopytrade.hasTraded === false
  ) {
    if (user) {
      if (autocopytrade.profitLoss === true) {
        user.wallet = user.wallet + autocopytrade.amount;
      } else if (autocopytrade.profitLoss === false) {
        user.wallet = user.wallet - autocopytrade.amount;
      }

      await user.save();
      autocopytrade.hasTraded = true;
      await autocopytrade.save();
      EmailNotification(
        user.email,
        `<p>Hi ${
          user.name
        } <br> <div>There is a new update on your Auto Copy Trader Subscription Plan On (Pro Live Trader) Platform</div><br>
            <div>You made a ${
              autocopytrade.profitLoss ? "Profit" : "Loss"
            } of $${autocopytrade.amount}<br> on the Asset ${
          autocopytrade.assets
        }<br> on ${new Date()}</div></p>`,
        "Auto CopyTrade Report"
      );

      res.json(autocopytrade);
    } else {
      res.status(400).send("user does not exist");
    }
  } else {
    res
      .status(400)
      .send("Not yet  time to trade or trade has been executed already");
  }
});

// @desc   Edit single AutoCopyTrades
// @route   PUT/api/autocopytrade/:id
//@access  Admin and Manager

app.put("/updatetrade/:id", async (req, res) => {
  const { id } = req.params;
  const { profitLoss, market, amount, assets, scheduledTime } = req.body;
  const autocopytrade = await AutoCopyTrade.findById(id);
  autocopytrade.profitLoss = profitLoss;
  autocopytrade.market = market;
  autocopytrade.amount = amount;
  (autocopytrade.assets = assets),
    (autocopytrade.scheduledTime = scheduledTime),
    await autocopytrade.save();
  try {
    res.json(autocopytrade);
  } catch (error) {
    res.json({ error: error.message });
  }
});

// @desc    Delete a user by ID
// @route   DELETE /:id
//@access Admin and Manager
app.delete("/:id", async (req, res) => {
  let { id } = req.params;
  const autocopytrade = await AutoCopyTrade.findOneAndDelete({ _id: id });
  if (autocopytrade) {
    res.status(200).send("autocopytrade successfully deleted");
  } else res.status(400).send("autocopytrade with this id does not exist");
});

module.exports = app;
