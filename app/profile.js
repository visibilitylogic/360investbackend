const _ = require("lodash");
const Registration = require("../model/Registration");
const SiteSettings=require("../model/Site")
const express = require("express");
const app = express();
const { cloudinary } = require("../utils/cloudinary");
const bcrypt = require("bcrypt");


app.get("/single/:id", async (req, res) => {
  const { id } = req.params;
  const user = await Registration.findById(id);
  if(user){
    res.status(200).json(user);
  }
else(res.status(400).send("This user dos not exist"))
});



// @desc   User change Proflle Update
// @route   PUT /api/profile/update/user
//@access Admin and user
app.put("/update/user", async (req, res) => {
  let { id, email, phoneNumber, name, password } = req.body;
  const user = await Registration.findById(id);
  const Salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(password, Salt);

  if (user) {
    user.email = email;
    user.name = name;
    user.newPassword = newPassword;
    user.phoneNumber = phoneNumber;

    await user.save();
    res.status(200).json(user);
  } else {
    res.status(404).send("User not Found");
  }
});

// @desc   User change Proflle Update
// @route   PUT /api/profile/update
//@access Admin and user
app.put("/update", async (req, res) => {
  let { id, email, language, currency, name, setRole } = req.body;
  const user = await Registration.findById(id);

  if (user) {
    user.email = email;
    user.language = language;
    user.currency = currency;
    user.name = name;

    if (setRole == "isAdmin") {
      user.isAdmin = true;
      user.isManager == false;
    } else if (setRole == "isManager") {
      user.isAdmin = false;
      user.isManager = true;
    } else if (setRole == "none") {
      user.isAdmin = false;
      user.isManager = false;
    }

    await user.save();
    res.status(200).json(user);
  } else {
    res.status(404).send("User not Found");
  }
});

// @desc   User change Proflle Passport
// @route   PUT /api/profile/passport
//@access Admin and user
app.put("/passport", async (req, res) => {
  let { Img, id } = req.body;
  const user = await Registration.findById(id);

  if (user) {
    const uploadResponse = await cloudinary.uploader.upload(Img);

    user.img = uploadResponse.secure_url;

    await user.save();

    res.json(user);
  } else {
    res.status(404).json("User not Found");
  }
});

// @desc   User Bank Details
// @route   PUT /api/profile/userbankdetails
//@access Admin and user
app.put("/userbankdetails", async (req, res) => {
  const {
    bankName,
    bankAddress,
    bankCity,
    bankCountrybankAccountNumber,
    bankSwiftCode,
    userBankfULLName,
    userAddress,
    userCity,
    userCountry,
    id,
  } = req.body;
  const user = await Registration.findById(id);
  if (user) {
    const details = {
      tag: "Bank Transfer",
      name: user.name,
      bankName: bankName,
      bankAddress: bankAddress,
      bankCity: bankCity,
      bankCountrybankAccountNumber: bankCountrybankAccountNumber,
      bankSwiftCode: bankSwiftCode,
      userBankfULLName: userBankfULLName,
      userAddress: userAddress,
      userCity: userCity,
      userCountry: userCountry,
      id: id,
    };

    user.bankDetails.push(details);
    let bankDetails = user.bankDetails;
    user.bankDetails = bankDetails;

    await user.save();

    res.json(user.bankDetails);
  } else {
    res.status(404);
    throw new Error("Problems updating user bank details");
  }
});

// @desc   Remove A sepcific bank detail by index
// @route   PUT /api/profile/userremovebankdetails
//@access Admin and user
app.put("/userremovebankdetails", async (req, res) => {
  const { index, id } = req.body;
  const user = await Registration.findById(id);
  if (user) {
    user.bankDetails = user.bankDetails.filter(
      (data) => user.bankDetails[index] !== data
    );

    await user.save();

    res.json(user.bankDetails);
  } else {
    res.status(404);
    throw new Error("Problems updating user bank details");
  }
});

// @desc   User Cryptocurrency Wallet Details
// @route   PUT /api/profile/usercryptodetails
//@access Admin and user
app.put("/usercryptodetails", async (req, res) => {
  const { cryptoCurrencyName, cryptoCurrencyAddress, id } = req.body;
  const user = await Registration.findById(id);
  if (user) {
    const details = {
      tag: "Cryptocurrency",
      name: user.name,
      cryptoCurrencyName: cryptoCurrencyName,
      cryptoCurrencyAddress: cryptoCurrencyAddress,
      id: id,
    };

    user.cryptocurrencyWallet.push(details);
    let cryptocurrencyWallet = user.cryptocurrencyWallet;
    user.cryptocurrencyWallet = cryptocurrencyWallet;

    await user.save();

    res.json(user.cryptocurrencyWallet);
  } else {
    res.status(404);
    throw new Error("Problems updating cryptocurrency details");
  }
});

// @desc   Remove A sepcific crypto detail by index
// @route   PUT /api/profile/userremovecryptodetails
//@access Admin and user
app.put("/userremovecryptodetails", async (req, res) => {
  const { index, id } = req.body;
  const user = await Registration.findById(id);
  if (user) {
    user.cryptocurrencyWallet = user.cryptocurrencyWallet.filter(
      (data) => user.cryptocurrencyWallet[index] !== data
    );

    await user.save();

    res.json(user.cryptocurrencyWallet);
  } else {
    res.status(404);
    throw new Error("Problems updating user bank details");
  }
});

// @desc   User Payment Card
// @route   PUT /api/profile/userPaymentCardDetails
//@access Admin and user
app.put("/userPaymentCardDetails", async (req, res) => {
  const { cardNumber, cardName, cardCvv, cardYear, id } = req.body;
  const user = await Registration.findById(id);
  if (user) {
    const details = {
      tag: "Bank Transfer",
      name: user.name,
      cardName: cardName,
      cardNumber: cardNumber,
      cardCvv: cardCvv,
      cardYear: cardYear,
      userId: id,
    };

    user.myPaymentCard.push(details);
    let myPaymentCard = user.myPaymentCard;
    user.myPaymentCard = myPaymentCard;

    await user.save();

    res.json(user.myPaymentCard);
  } else {
    res.status(404);
    throw new Error("Problems updating payment Card details");
  }
});

// @desc   Remove A sepcific Payment Card detail by index
// @route   PUT /api/profile/userRemovePaymentCardDetail
//@access Admin and user
app.put("/userRemovePaymentCardDetail", async (req, res) => {
  const { index, id } = req.body;
  const user = await Registration.findById(id);
  if (user) {
    user.myPaymentCard = user.myPaymentCard.filter(
      (data) => user.myPaymentCard[index] !== data
    );

    await user.save();

    res.json(user.myPaymentCard);
  } else {
    res.status(404);
    throw new Error("Problems updating user bank details");
  }
});

// @desc   GET USER Card Details
// @route  GET /api/profile/paymentDetails
//@access Admin and user
app.get("/paymentDetails/:id", async (req, res) => {
  const { id } = req.params;
  const user = await Registration.findById(id);
  if (user) {
    res.json({ banks: user.bankDetails, crypto: user.cryptocurrencyWallet });
  } else {
    res.status(400).json("Problems getting user bank details");
  }
});
// @desc   GET USER Notifications
// @route  GET /api/profile/notifications
//@access Admin and user
app.get("/notifications/:id", async (req, res) => {
  const { id } = req.params;
  const user = await Registration.findById(id);
  if (user) {
    res.json({ notifications: user.notify });
  } else {
    res.status(400).json("Problems getting user notfications");
  }
});

// @desc   SET auto Trade
// @route  PUT /api/profile/autoTrade
//@access Admin and user
app.put("/autoTrade", async (req, res) => {
  const { isTrading, autoTrade, id } = req.body;
  const user = await Registration.findById(id);
  if (user) {
    user.autoTrade = autoTrade;
    user.isTrading = isTrading;
    user.save();
    res.status(200).json(user);
  } else {
    res.status(400).json("user not found");
  }
});
// @desc   SET Trading
// @route  PUT /api/profile/isTrading
//@access Admin and user
app.put("/isTrading", async (req, res) => {
  const { isTrading, id } = req.body;
  const user = await Registration.findById(id);
  if (user) {
    user.isTrading = isTrading;
    user.save();
    res.status(200).json(user);
  } else {
    res.status(400).json("user not found");
  }
});

// @desc    SITE LIVETRADE SETTINGS BY ID 61115addb31f2b97ae0fb873
// @route   PUT /api/profile/liveTrade
// @access  Admin
app.put("/liveTrade", async (req, res) => {
  const { id } = req.body;
  const user = await Registration.findById(id);
  if (user) {
    user.liveTrade = req.body.liveTrade;
    await user.save();
    res.json(user);
  } else {
    res.status(404).send("User Live Trade can not be updated");
  }
});

// @desc    SITE LIVETRADE SETTINGS BY ID 61115addb31f2b97ae0fb873
// @route   PUT /api/profile/stopUserAutoTrade
// @access  Admin
app.put("/stopUserAutoTrade", async (req, res) => {
  const { id } = req.body;
  const user = await Registration.findById(id);
  if (user) {
    user.stopUserAutoTrade = req.body.stopUserAutoTrade;
    await user.save();

    res.json(user);
  } else {
    res.status(404).send(" can not stope trade at this moment, try again");
  }
});

// @desc    SITE LIVETRADE SETTINGS BY ID 61115addb31f2b97ae0fb873
// @route   PUT /api/profile/liveTrade
// @access  Admin
app.put("/users/liveTrade", async (req, res) => {
  try {
    const users = await Registration.find({});
    const siteset = await SiteSettings.findById("61115addb31f2b97ae0fb873");
    siteset.liveTrade=req.body.liveTrade;
    res.send("liveTrade successfull switched for all users");
    siteset.save()
    users.filter((user) => {
      user.liveTrade = req.body.liveTrade;
    user.save()
    });
    users.save();
    res.status(200).send("liveTrade successfull switched for all users");
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

// @desc    SITE LIVETRADE SETTINGS BY ID 61115addb31f2b97ae0fb873
// @route   PUT /api/profile/CreditDebitAmount
// @access  Admin
app.put("/CreditDebitAmount", async (req, res) => {
  const { id, action, amount } = req.body;
  const user = await Registration.findById(id);
  if (user) {
    if (action === true) {
      user.wallet = user.wallet + parseInt(amount);
      user.estimatedBalance = user.estimatedBalance + parseInt(amount);
      await user.save();
    } else if (action === false) {
      if (user.wallet - parseInt(amount) < 0) {
        res
          .status(404)
          .send(
            "  To perform a debit TRANSACTION, wallet must be greater than $" +
              amount +
              " or reduce your wallet to  be less than or equal to $" +
              user.wallet
          );
      } else {
        user.wallet = user.wallet - parseInt(amount);
        user.estimatedBalance = user.estimatedBalance - parseInt(amount);
        await user.save();
      }
    }

    res.json(user);
  } else {
    res
      .status(404)
      .send(
        "can take action at this time to credit or debit wallet, try again"
      );
  }
});

module.exports = app;
