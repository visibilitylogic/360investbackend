const Registration = require("../model/Registration");
const Deposit = require("../model/Deposit");
const shortid = require('shortid');
const express = require("express");
const app = express();

// @desc   Deposit into my wallet
// @route   POST /api/deposit
//@access Admin and user
 
app.post("/", async (req, res) => {
  const {
    method,
    currency,
    cardYear,
    cardCvv,
    cardMonth,
    cardNumber,
    amount,
    cardName,
    fee,
    id,
    homeAddress,
    zipCode,
    yourCountry,
    yourState,
    cryptoAddress
  } = req.body;

  const user = await Registration.findById(id);
  if (user) {
    const details = {
      cardName: cardName,
      userId: id,
      cardNumber: cardNumber,
      cardMonth: cardMonth,
      cardCvv: cardCvv,
      cardYear: cardYear,
      name: user.name,
      currency: currency,
      email: user.email,
      method: method,
      amount: amount,
      fee:fee,
      homeAddress:homeAddress,
      zipCode:zipCode,
      yourCountry:yourCountry,
      yourState:yourState,
      cryptoAddress:cryptoAddress,
      Ref: shortid.generate(),
      date: new Date(),
   
    };
    const deposit = new Deposit(details);

    await deposit.save();
    res.json(deposit);
  } else {
    res.status(404).send("Problems Depositing funds as user does not exist");
  }

});

// @desc   My Deposit History
// @route   GET/api/deposit/myHistory
//@access  user

app.get("/myHistory", async (req, res) => {
  const { id } = req.body;
  const deposit = await Deposit.find({});
  const user = await Registration.findById(id);
  
  if (user) {
    let myDeposits=deposit.filter((e)=>(e.userId).toString()===(user._id).toString())
    res.status(200).json(myDeposits)
  } else {
    res.status(404).json("User Not found");
  }
});



//@desc   Admin Approve A deposit
// @route   PUT/api/deposit/approve
//@access  Admin
app.put("/approve", async (req, res) => {
  const{id}=req.body
    const DepositRequest = await Deposit.findById(id);

    const user = await Registration.findById(DepositRequest.userId);
    if (user) {
  let message={desc:req.body.message, topic:"deposie was approved"}
    user.notify.push(message);
    let notify = user.notify;
    user.notify = notify;
 
    
      user.wallet=user.wallet+DepositRequest.amount
      user.estimatedBalance=user.estimatedBalance+DepositRequest.amount
      DepositRequest.status="Approved"
      let approveDeposit= await DepositRequest.save()
      await user.save()
  
      res.status(201).json({approveDeposit});
    } else {
      res.status(404).json("Transaction Does not exist");
    }
  });
  
// @desc   Admin Approve A Deposit
// @route   PUT/api/withdraw/decline
//@access  Admin
app.put("/decline", async (req, res) => {
  const{id}=req.body
  const DepositRequest = await Deposit.findById(id);

  const user = await Registration.findById(DepositRequest.userId);
    if (user) {
  let message={desc:req.body.message, topic:"deposite request was declined"}
    user.notify.push(message);
    let notify = user.notify;
    user.notify = notify;
 
     
      
      DepositRequest.status="Declined"
      let declinedDeposite= await DepositRequest.save()
      await user.save()
  
      res.status(201).json({declinedDeposite});
    } else {
      res.status(404).json("Transaction Does not exist");
    }
  });


// @desc   Get all withdrawal history
// @route   GET/api/deposit/AllHistory
//@access  Admin and Manager

app.get("/AllHistory", async (req, res) => {
  const deposit = await Deposit.find({});
res.status(200).json(deposit.reverse())
});

module.exports = app;
