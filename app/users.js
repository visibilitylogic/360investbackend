const Registration = require("../model/Registration");
const app = require("./verification");

// @desc    Get all users
// @route   GET /users/allBankDetails
//@access Admin and Manager
app.get("/allUser", async (req, res) => {
  const user = await Registration.find({});
  res.status(200).send(user.reverse());
});

// @desc    Make an Admin
// @route   PUT /users/makeAdmin
//@access Admin and Manager
app.put("/makeAdmin", async (req, res) => {
  const user = await Registration.findById(req.body.id);
  if(user){
  
  user.isAdmin=true
  user.save()
  res.status(200).send(user);
}else res.status(400).json("user does not exist")
});
// @desc    Make an Admin
// @route   PUT /users/makeAdmin
//@access Admin and Manager
app.put("/removeAdmin", async (req, res) => {
  const user = await Registration.findById(req.body.id);
  if(user){
  
  user.isAdmin=false
  res.status(200).send(user);
  user.save()
  }else res.status(400).json("user does not exist")
});

// @desc    Make a Manager
// @route   PUT /users/makeManager
//@access Admin and Manager
app.put("/makeManager", async (req, res) => {
  const user = await Registration.findById(req.body.id);
  if(user){
  
  user.isManager=true
  user.save()
  res.status(200).send(user);
}else res.status(400).json("user does not exist")
});
// @desc    Make an Admin
// @route   PUT /users/removeManager
//@access Admin and Manager
app.put("/removeManager", async (req, res) => {
  const user = await Registration.findById(req.body.id);
  if(user){
 
  user.isAdmin=false
  user.save()
  res.status(200).send(user);
}else res.status(400).json("user does not exist")
});
// @desc    Delete a user by ID
// @route   DELETE /user/remove/:id
//@access Admin and Manager
app.delete("/remove", async (req, res) => {
  let { id } = req.body;
  const user = await Registration.findOneAndDelete({ _id: id });
  if (user) {
    res.status(200).send("user successfully deleted");
    
  } else res.status(400).send("user with this id does not exist");
});


// @desc    GET a user by ID
// @route   GET /user/:id
//@access Admin and Manager
app.delete("/:id", async (req, res) => {
  let { id } = req.params;
  const user = await Registration.findById(id);
  if (user) {
    res.status(200).send(user);
    
  } else res.status(400).send("user with this id does not exist");
});


module.exports = app;
