const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  img: {
    type: String,
  },
  price: {
    type: Number,
  },
  desc: {
    type: String,
  },
  reviews: [
    {
      //type is not primitive so we have to specify like this
      type: mongoose.Schema.Types.ObjectId,
      //referencing to the Review model
      ref: "Review",
    },
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

//Export the model
module.exports = mongoose.model("Product", productSchema);
