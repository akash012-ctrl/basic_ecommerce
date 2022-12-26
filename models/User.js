const mongoose = require("mongoose"); // Erase if already required
const passportLocalMongoose = require("passport-local-mongoose");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
  // username:String, --> this is automatically added by the passport-local-mongoose, no need to add ourselves
  // password:String,  --> this is automatically added by the passport-local-mongoose
  email: String,
  cart: [
    {
      _id: { id: false },
      name: String,
      price: Number,
      img: String,
      id: mongoose.Schema.Types.ObjectId,
      count: {
        type: Number,
        default: 1,
        min: [0, "Quantity Cannot be less than 1"],
      },
    },
  ],
  userType:{
    type:String,
    enum:['consumer','retailer'],
    default:'consumer'
  }
});

// it will automatically hash the password
userSchema.plugin(passportLocalMongoose);

//Export the model
module.exports = mongoose.model("User", userSchema);
