const { string } = require("joi");
const mongoose = require("mongoose");
const schema = mongoose.Schema();

const TradeSchema = new mongoose.Schema(
  {
    tag: { type: String },
    stockName: { type: String },
    stockAmount: { type: String },
    buyW: { type: String },
    userId:{ type: String },
    unit:{ type: String },
    profit: { type: String },
    loss: { type: String },
    active: { type: Boolean },
    time: { type: Date, default: Date.now },
  },
  { collection: "trade" }
);

const Trade = mongoose.model("TradeSchema", TradeSchema);
module.exports = Trade;
