const mongoose = require("mongoose");
const schema = mongoose.Schema();

const AutoCopyTradeSchema = new mongoose.Schema(
  {
    userId:{ type: String },
    profitLoss: { type: Boolean},
    market: { type: String},
    date: { type: Date, default: Date.now },
    currentBalance:{type:Number, default:0},
    amount:{type:Number, default:0},
    assets:{type:String},
    scheduledTime:{type: Date, default: Date.now},
    hasTraded:{type:Boolean, default:false}
  },
  { collection: "autocopytrade" }
);

const AutoCopyTrade = mongoose.model("AutoCopyTradeSchema", AutoCopyTradeSchema);
module.exports = AutoCopyTrade;
