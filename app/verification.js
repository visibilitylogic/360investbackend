const Registration = require("../model/Registration");
const Verify = require("../model/Verify");
const express = require("express");
const app = express();
const { cloudinary } = require("../utils/cloudinary");
const Site = require("../model/Site")

// @desc   User Verification ARequest
// @route   POST /api/verify/verificationrequest
//@access  user
app.post("/verificationrequest", async (req, res) => {
  const { documentName, documentFile,Img,proofDocument, address, id,phoneNumber } = req.body;
  // documentFile: this.state.doc,
  // Img:this.state.docPass,
  // proofDocument:this.state.docProof
  const user = await Registration.findById(id);
if(user&&user.isPendingVerification===true){
  res.status(200).send("Kindly wait for your initial request to be responded")
}
  else if (user&&user.isPendingVerification==false) {
    // const fileStr = ;
    const uploadResponse = await cloudinary.uploader.upload(documentFile);
    const uploadImg= await cloudinary.uploader.upload(Img);  
     const uploadProof= await cloudinary.uploader.upload(proofDocument);
    
     const waitingVerification = new Verify({
      name: req.body.name,
      documentName: documentName,
      documentFile: uploadResponse.secure_url,
      Img:uploadImg.secure_url,
      proofDocument:uploadProof.secure_url,
      address: address,
      userId: id,
      phoneNumber:phoneNumber,
      status:"Pending"
    });
    user.isPendingVerification = true;
    await user.save();
    const verifywait = await waitingVerification.save();

    res.status(201).json(verifywait);
  } else {
    res.status(404).json("User does not exist");
  }
});

// @desc   Admin Get Verification Requests Applications pending verifications
// @route  GET /api/profile/pendingverifications
//@access Admin
app.get("/pendingverifications", async (req, res) => {
  // const users = await Registration.find({});
  const verificationRequest = await Verify.find({});
  try {
    let pendingRequests = verificationRequest .filter(
      (e) => e.status=="Pending"
    );
    if(pendingRequests.length>0)res.status(200).json(pendingRequests.reverse())
  else(
    res.status(200).send("No user awaiting approval") 
  )
} catch (error) {
    res.json({ error: error.message });
  
};
})

// @desc   Admin Get Verification Requests Applications pending verifications
// @route  GET /api/verify
//@access Admin
app.get("/", async (req, res) => {
  // const users = await Registration.find({});
  const verificationRequest = await Verify.find({});
  try {
    res.status(200).json(verificationRequest.reverse())
} catch (error) {
    res.json({ error: error.message });
  
};
})

// @desc   Admin Approve A Request
// @route   POT/api/verify/approve
//@access  Admin
app.put("/approve", async (req, res) => {
  const{id}=req.body
   
    const verificationRequest = await Verify.find({userId:id});
    let vid=verificationRequest[0]._id
  const statusToChange=await Verify.findById(vid)
    const user = await Registration.findById(id);
    if (user) {
  let message={desc:req.body.message, topic:"validation was successful"}
    user.notify.push(message);
    let notify = user.notify;
    user.notify = notify;
 
      user.isPendingVerification = false;
      user.verify=true
      user.img=statusToChange.Img
      user.phoneNumber=statusToChange.phoneNumber
      statusToChange.status="Approved"
      await statusToChange.save()
     let approvedUser= await user.save()
  
      res.status(201).json({approvedUser});
    } else {
      res.status(404).json("User does not exist");
    }
  });
  

  // @desc   Admin Decline A Request
// @route   PUT/api/verify/decline
//@access  Admin
app.put("/decline", async (req, res) => {
  const{id}=req.body
  const verificationRequest = await Verify.find({userId:id});
    let vid=verificationRequest[0]._id
    const statusToChange=await Verify.findById(vid)
   
    const user = await Registration.findById(id);
    if (user) {
  let message={desc:req.body.message,topic:"Validation Declined"}
    user.notify.push(message);
    let notify = user.notify;
    user.notify = notify;
  
    statusToChange.status="Declined"
    await statusToChange.save()
      user.isPendingVerification = false;
      user.verify=false
     let declinedVerification= await user.save();
      
  
      res.status(201).json(declinedVerification);
    } else {
      res.status(404).json("User does not exist");
    }
  });
module.exports = app;


