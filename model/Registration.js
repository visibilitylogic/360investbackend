const mongoose = require("mongoose");
const schema = mongoose.Schema();

const RegistrationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 50 },
    lastname: { type: String,  minlength: 3, maxlength: 50 },
    country:{type:String,default:""},
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true,
    },
    phoneNumber:{type:String,default:""},
    time: { type: Date, default: Date.now },
    wallet: { type: Number ,default:0},
    estimatedBalance:{type:Number, default:0},
    language: { type: String },
    currency: { type: String },
    typeChart: { type: String },
    img: { type: String },
    notify: [],
    address:{type:String,default:""},
    verify: { type: Boolean },
    isManager: { type: Boolean },
    isAdmin: { type: Boolean },
    reset_token:{type:String, default:""},
    newPassword: { type: String},
    bankDetails:[],
    cryptocurrencyWallet:[],
    isPendingVerification:{type:Boolean, default:false},
    myDeposits:[],
    isSubscribed:{type:Boolean, default:false},
    subcriptionPlan:[],
    subcriptionDate:{type:Date},
    myWitdrawals:[],
    myPaymentCard:[],
    notificationsEnabled: { type: Boolean, default:true },
    autoTrade:{type:Boolean, default:false},
    isTrading:{type:Boolean, default:false},
    lastAutoTradeDate:{type:Date, default: Date.now},
    liveTrade:{type:Boolean,default:false},
    stopUserAutoTrade:{type:Boolean,default:false},
  },
  { collection: "registration" }
);

const Model = mongoose.model("RegistrationSchema", RegistrationSchema);
module.exports = Model;
