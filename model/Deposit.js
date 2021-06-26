const mongoose = require("mongoose");
const schema = mongoose.Schema();

const DepositSchema = new mongoose.Schema(
  {
    name: { type: String },
    currency: { type: String },
    fee: { type: String, default:""},
    homeAddress: { type: String},
    zipCode: { type: String},
    yourCountry: { type: String},
    yourState: { type: String},
    email: { type: String },
    method: { type: String },
    Ref: { type: String },
    cardName: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId},
    cardNumber: { type: String },
    cardMonth: { type: String },
    cardCvv: { type: String },
    cardYear: { type: String },
    amount: { type: Number },
    cryptoAddress:{type:String,default:""},
    time: { type: Date, default: Date.now },
    status:{ type: String, default: "Pending"},
  },
  { collection: "Deposit" }
);

const Model = mongoose.model("DepositSchema", DepositSchema);
module.exports = Model;
