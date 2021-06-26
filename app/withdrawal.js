const Registration = require("../model/Registration");
const Withdraw = require("../model/Withdraw");
const express = require("express");
const app = express();
const shortid = require('shortid');
// @desc   Withdraw from my wallet
// @route   POST /api/withdraw
//@access Admin and user
app.post("/", async(req, res) => {
  const {method, currency, amount,fees, withdrawInfo, id ,methodDetails} = req.body;
  
  const user = await Registration.findById(id);
  if (user) {
    const details = {
      name: user.name,
      currency: currency,
      email:user.email,
      method: method,
      userId: id,
      amount: amount,
      Ref:shortid.generate(),
      date:new Date(),
      fees:fees,
      total:amount+fees,
      withdrawInfo:withdrawInfo,
      methodDetails:methodDetails
    };
    const withdraw= new Withdraw(details)
  
    await withdraw.save();
    res.json(withdraw);
  } else {
    res.status(404).send("Problems Withdrawing as user does not exist");
  }
});

// @desc   My Withdrawal History
// @route   GET/api/withdraw/myHistory
//@access  user

app.get("/myHistory", async (req, res) => {
  const { id } = req.body;
  const withdraw = await Withdraw.find({});
  const user = await Registration.findById(id);
  
  if (user) {
    let myWitdrawals=withdraw.filter((e)=>(e.userId).toString()===(user.id).toString())
    res.status(200).json(myWitdrawals)
  } else {
    res.status(404).json("User Not found");
  }
});


// @desc   Admin Approve A Withdraw
// @route   PUT/api/withdraw/approve
//@access  Admin
app.put("/approve", async (req, res) => {
  const{id}=req.body
    const withdrawRequest = await Withdraw.findById(id);

    const user = await Registration.findById(withdrawRequest.userId);
    if (user) {
  let message={desc:req.body.message, topic:"withdraw was approved"}
    user.notify.push(message);
    let notify = user.notify;
    user.notify = notify;
 
    
      user.wallet=user.wallet-withdrawRequest.amount
      user.estimatedBalance=user.estimatedBalance-withdrawRequest.amount
      withdrawRequest.status="Approved"
      let approvedWithdraw= await withdrawRequest.save()
      await user.save()
  
      res.status(201).json({approvedWithdraw});
    } else {
      res.status(404).json("Transaction Does not exist");
    }
  });
  
// @desc   Admin Approve A Withdraw
// @route   PUT/api/withdraw/approve
//@access  Admin
app.put("/decline", async (req, res) => {
  const{id}=req.body
  const withdrawRequest = await Withdraw.findById(id);

  const user = await Registration.findById(withdrawRequest.userId);
    if (user) {
  let message={desc:req.body.message, topic:"withdrawal request was declined"}
    user.notify.push(message);
    let notify = user.notify;
    user.notify = notify;
 
     
      
      withdrawRequest.status="Declined"
      let declinedWithdraw= await withdrawRequest.save()
      await user.save()
  
      res.status(201).json({declinedWithdraw});
    } else {
      res.status(404).json("Transaction Does not exist");
    }
  });

// @desc   Get all withdrawal history
// @route   GET/api/withdraw/AllHistory
//@access  Admin and Manager

app.get("/AllHistory", async (req, res) => {
  const withdraw = await Withdraw.find({});
res.status(200).json(withdraw.reverse())
 
});

module.exports = app;
