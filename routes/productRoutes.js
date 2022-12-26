const express = require("express");
const   router = express.Router();
const Product = require("../models/Product");
const {isLoggedIn,isRetailer,isProductAuthor} = require('../middleware')


// Get all the products
router.get("/products", async (req, res) => {
  const products = await Product.find({});
  const message = req.flash("success");
  res.render("products/index", { products, message });
});



router.get("/products/new",isLoggedIn,isRetailer, (req, res) => {
  res.render("products/new");
});

// create a new product

router.post("/products",isLoggedIn,isRetailer, async (req, res) => {
  try {
    const { name, price, desc, img } = req.body;
     // Grab the current logged in user as author if this product
     const author = req.user._id;
    await Product.create({ name, price, desc, img ,author});
    req.flash("success", "Product Created SuccessFully");
    res.redirect("/products");
  } catch (e) {
    req.flash("error", "Cannot create the product at the moment");
    res.redirect("/products/new");
  }
});

// show a product
router.get("/products/:productid", async (req, res) => {
  const { productid } = req.params;
  const product = await Product.findById(productid).populate("reviews");
  res.render("products/show", { product});
});

// get the edit form
router.get("/products/:productid/edit",isLoggedIn,isRetailer,isProductAuthor, async (req, res) => {
  const { productid } = req.params;
  const product = await Product.findById(productid);
  res.render("products/edit", { product });
});

// update a product
router.patch("/products/:productid",isLoggedIn,isRetailer,isProductAuthor, async (req, res) => {
  const { productid } = req.params;
  const { name, price, desc, img } = req.body;
  await Product.findByIdAndUpdate(productid, { name, price, desc, img });
  req.flash("success", "Updated the Product SucessFully");

  res.redirect(`/products/${productid}`);
});

router.delete("/products/:productid",isLoggedIn,isRetailer,isProductAuthor, async (req, res) => {
  const { productid } = req.params;
  await Product.findByIdAndDelete(productid);
  res.redirect("/products");
});

module.exports = router;
