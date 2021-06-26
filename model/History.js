const { string } = require("joi");
const mongoose = require("mongoose");
const schema = mongoose.Schema();

const HistorySchema = new mongoose.Schema(
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
    date: { type: Date },
    time: { type: Date, default: Date.now },
  },
  { collection: "History" }
);

const History = mongoose.model("HistorySchema", HistorySchema);
module.exports = History;
