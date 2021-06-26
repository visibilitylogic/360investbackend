const mongoose = require("mongoose");
const schema = mongoose.Schema();

const WithdrawSchema = new mongoose.Schema(
  {
    status: { type: String, default:"Pending" },
    name: { type: String, default:"" },
    currency: { type: String, default:"" },
    email: { type: String, default:"" },
    method: { type: String, default:"" },
    fees:{ type: Number, default:0 },
    total:{ type: Number, default:0 },
    withdrawInfo: { type: String, default:"" },
    userId: { type: mongoose.Schema.Types.ObjectId},
    Ref:{type: String, default:"" },
    amount: { type: Number, default:0 },
    methodDetails:[],
    time: { type: Date, default: Date.now },
  },
  { collection: "Withdraw" }
);

const Model = mongoose.model("WithdrawSchema", WithdrawSchema);
module.exports = Model;
