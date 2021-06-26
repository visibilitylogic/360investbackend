const mongoose = require("mongoose");
const schema = mongoose.Schema();

const CopyTradeSchema = new mongoose.Schema(
  {
    userName: { type: String },
    profitPercentage: { type: Number},
    subscriptionFee: { type: Number},
    userId:{ type: String },
    active: { type: Boolean },
    date: { type: Date, default: Date.now },
  },
  { collection: "copytrade" }
);

const CopyTrade = mongoose.model("CopyTradeSchema", CopyTradeSchema);
module.exports = CopyTrade;
