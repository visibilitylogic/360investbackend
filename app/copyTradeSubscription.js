const CopyTrade = require("../model/CopyTradesSubscription");
const User = require("../model/Registration");
const express = require("express");
const app = express();

// @desc   Create CopyTrade
// @route   POST /api/copytrade
//@access Admin and user
app.post("/", async (req, res) => {
  const { userName, userId, profitPercentage, subscriptionFee } = req.body;
  const details = {
    userName: userName,
    userId: userId,
    profitPercentage: profitPercentage,
    subscriptionFee: subscriptionFee,
    date: new Date(),
  };
  const copytrade = new CopyTrade(details);
  await copytrade.save();
  try {
    res.json(copytrade);
  } catch (error) {
    res.json({ error: error.message });
  }
});

// @desc   Get all copyTrades
// @route   GET/api/copytrade
//@access  Admin and Manager

app.get("/", async (req, res) => {
  const copytrade = await CopyTrade.find({});
  res.status(200).json(copytrade.reverse());
});

// @desc   Get single copyTrades
// @route   GET/api/copytrade/:id
//@access  Admin and Manager

app.get("/:id", async (req, res) => {
  const { id } = req.params;
  const copytrade = await CopyTrade.findById(id);
  res.status(200).json(copytrade);
});

// @desc   Edit single copyTrades
// @route   PUT/api/copytrade/:id
//@access  Admin and Manager

app.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { userName, userId, profitPercentage, subscriptionFee } = req.body;
  const copytrade = await CopyTrade.findById(id);
  copytrade.userName = userName;
  copytrade.userId = userId;
  copytrade.profitPercentage = profitPercentage;
  copytrade.subscriptionFee = subscriptionFee;
  await copytrade.save();
  try {
    res.json(copytrade);
  } catch (error) {
    res.json({ error: error.message });
  }
});

// @desc    Delete a user by ID
// @route   DELETE /:id
//@access Admin and Manager
app.delete("/:id", async (req, res) => {
    let { id } = req.params;
    const copytrade = await CopyTrade.findOneAndDelete({ _id: id });
    if (copytrade) {
      res.status(200).send("copytrade successfully deleted");
      
    } else res.status(400).send("copytrade with this id does not exist");
  });

  // @desc   Edit single copyTrades
// @route   PUT/api/copytrade/:id
//@access  Admin and Manager

app.put("/subscribe/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const copytrade = await CopyTrade.findById(id);
  const user=await User.findOne({_id:userId})
  try {
    if(copytrade){
  if(user){
    user.isSubscribed=true
    user.subcriptionDate=new Date()
    user.subcriptionPlan=copytrade
    user.wallet=user.wallet-copytrade.subscriptionFee
    user.estimatedBalance=user.estimatedBalance-copytrade.subscriptionFee
    await user.save();
    res.status(200).json(user);
  }
   else{
     res.status(400).json({error:"no user with this ID exist"})
   }
  }else res.status(400).json({error:"this trade does not exist"})
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.put("/unSubscribe/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const copytrade = await CopyTrade.findById(id);
  const user=await User.findOne({_id:userId})
  try {
    if(copytrade){
      copytrade.active=false
      await copytrade.save()
  if(user){
    user.isSubscribed=false
    await user.save();
    res.status(200).json(user);
  }
   else{
     res.status(400).json({error:"no user with this ID exist"})
   }
  }else res.status(400).json({error:"this trade does not exist"})
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
module.exports = app;
