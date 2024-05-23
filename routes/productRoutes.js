const express = require("express");
const router = express.Router();
const {
  addProduct,
  addAllProducts,
  getAllProducts,
  getShowingProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  updateManyProducts,
  updateStatus,
  deleteProduct,
  deleteManyProducts,
  getShowingStoreProducts,
  addReview,
  updateReview,
  deleteReview,
  verifyMobileOTP,
  getPaymentMethods,
  submitAddress,
  getOrderSummary,
  addPayment,
  getPaymentMethodsHandler,
  getRatingsForProduct,
} = require("../controller/productController");

//add a product
router.post("/add", addProduct);

//add multiple products
router.post("/all", addAllProducts);

//get a product
// router.post("/:id", getProductById);
// changed for now
router.get("/product/:id", getProductById);

//get showing products only
router.get("/show", getShowingProducts);

//get showing products in store
router.get("/store", getShowingStoreProducts);

//get all products
router.get("/", getAllProducts);

//get a product by slug
router.get("/product/:slug", getProductBySlug);

//update a product
router.patch("/:id", updateProduct);

//update many products
router.patch("/update/many", updateManyProducts);

//update a product status
router.put("/status/:id", updateStatus);

//delete a product
router.delete("/:id", deleteProduct);

//delete many product
router.patch("/delete/many", deleteManyProducts);

// get Ratings
router.get("/:id/ratings", getRatingsForProduct);

// add review
router.post("/:id/reviews", addReview);

// update reviews
router.patch("/:productId/reviews/:reviewId", updateReview);

// delete reviews
router.delete("/reviews/:reviewId", deleteReview);

// Step 1: Mobile OTP verification
router.post("/mobile-otp/verify", verifyMobileOTP);

// Step 2: Get available payment methods
router.post("/:id/payment", addPayment);

router.get("/:id/payment", getPaymentMethodsHandler);

// Step 3: Submit shipping address
router.post("/:id/address", submitAddress);

// Step 4: Get order summary
router.get("/order-summary", getOrderSummary);
module.exports = router;
