const mongoose = require("mongoose");
const schema = mongoose.Schema();

const VerifySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, },
    documentName:{type:String, default:""},
    documentFile: { type: String },
    Img:{type:String, default:""},
    proofDocument:{type:String, default:""},
    address:{type:String},
    phoneNumber: { type: String,default:"" },
    time: { type: Date, default: Date.now },
    userId:{type: mongoose.Schema.Types.ObjectId},
    status:{type:String, default:"Pending"}
  },
  { collection: "verify" }
);

const Model = mongoose.model("VerifySchema", VerifySchema);
module.exports = Model;
