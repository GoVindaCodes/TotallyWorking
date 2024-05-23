const Product = require("../models/Product");
const mongoose = require("mongoose");
const Category = require("../models/Category");
const { languageCodes } = require("../utils/data");
const ProductData = require('../models/Product');


const addProduct = async (req, res) => {
  try {
    // Log the request body
    console.log('Request body:', req.body);

    // Create a new product
    const newProduct = new Product({
      ...req.body,
      productId: req.body.productId
        ? req.body.productId
        : mongoose.Types.ObjectId(),
    });

    // Save the new product
    await newProduct.save();

    // Log the saved product
    console.log('New product saved:', newProduct);

    // Send the new product as the response
    res.send(newProduct);
  } catch (err) {
    // Log the error
    console.log('Error saving product:', err);

    // Send an error response
    res.status(500).send({
      message: err.message,
    });
  }
};



// -----------------------Reviews--------------------------------
// const addReview = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (product) {
//       const { rating, comment } = req.body;

//       const review = {
//         user: req.user._id,
//         rating,
//         comment,
//       };

//       product.reviews.push(review);

//       product.averageRating =
//         product.reviews.reduce((acc, item) => item.rating + acc, 0) /
//         product.reviews.length;

//       await product.save();
//       res.status(201).send({ message: "Review added successfully" });
//     } else {
//       res.status(404).send({ message: "Product not found" });
//     }
//   } catch (err) {
//     res.status(500).send({
//       message: err.message,
//     });
//   }
// };

const getRatingsForProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await ProductData.findById(id);
    console.log("--------------------------", product)
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const ratings = product.reviews;
    console.log("===========================", ratings);
    console.log("--------------------------", id)

    if (ratings.length > 0) {
      res.status(200).json({ ratings });
    } else {
      res.status(404).json({ message: "No ratings found for product with ID: " + id });
    }
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addReview = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log("------------------------------------------------------", productId);
    const { rating, comment, user } = req.body;
    console.log("ratings", rating)
    console.log("comments", comment)
    console.log("users", user)
    const product = await Product.findById(productId);
    console.log("------------------------------------------------------", product)
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const review = {
      rating,
      comment,
      user,
    };
    product.reviews.push(review);
    await product.save();
    const newReview = product.reviews[product.reviews.length - 1]; // Get the last review in the array (the newly added one)
    console.log("-=-=-=-=-=-=-=-===================---------------", newReview)
    return res.status(201).json({ review: newReview }); // Send the new review with its ID
    // return res.status(201).json({ review });
  } catch (error) {
    console.error("Error adding review:", error);
    return res.status(500).json({ message: "Failed to add review" });
  }
};

const updateReview = async (req, res) => {
  console.log("---------------------------------------------------------", req.body)
  try {
    const product = await Product.findById(req.params.productId);
    console.log("products:=============================", product)
    if (product) {
      const review = product.reviews.id(req.body._id);
      console.log("reviewss ==============================", review)
      if (review) {
        review.rating = req.body.rating || review.rating;
        review.comment = req.body.comment || review.comment;

        product.averageRating =
          product.reviews.reduce((acc, item) => item.rating + acc, 0)
        product.reviews.length;

        await product.save();
        console.log("Review updated successfully:", product);
        res.send({ review });
      } else {
        console.log("Review not found");
        res.status(404).send({ message: "Review not found" });
      }
    } else {
      console.log("Product not found");
      res.status(404).send({ message: "Product not found" });
    }
  } catch (err) {
    console.error("Error updating review:", err.message);
    res.status(500).send({
      message: err.message,
    });
  }
};

// const deleteReview = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.productId);

//     if (product) {
//       const review = product.reviews.id(req.params.reviewId);
//       if (review) {
//         review.remove();
//         product.averageRating =
//           product.reviews.reduce((acc, item) => item.rating + acc, 0) /
//           product.reviews.length || 0;

//         await product.save();
//         console.log("Review deleted successfully:", product);
//         res.send({ message: "Review deleted successfully" });
//       } else {
//         console.log("Review not found");
//         res.status(404).send({ message: "Review not found" });
//       }
//     } else {
//       console.log("Product not found");
//       res.status(404).send({ message: "Product not found" });
//     }
//   } catch (err) {
//     console.error("Error deleting review:", err.message);
//     res.status(500).send({
//       message: err.message,
//     });
//   }
// };

const deleteReview = async (req, res) => {
  try {
    console.log("Deleting review with ID:", req.params.reviewId);
    const product = await Product.findOne({ "reviews._id": req.params.reviewId });
    if (product) {
      console.log("Product found:", product);
      product.reviews = [];
      await product.save();
      console.log("All reviews deleted successfully for product:", product);
      res.send(null);
    } else {
      console.log("Product not found for review ID:", req.params.reviewId);
      res.status(404).send({ message: "Product not found" });
    }
  } catch (err) {
    console.error("Error deleting reviews:", err.message);
    res.status(500).send({
      message: err.message,
    });
  }
};


// -----------------------Buy Now--------------------------------

const verifyMobileOTP = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;

    // Your logic to verify the OTP for the given mobile number

    // For example, you can compare the OTP received in the request with the OTP sent to the user's mobile number
    if (otp === "1234") {
      // OTP verification successful
      res.status(200).json({ message: "Mobile OTP verified successfully" });
    } else {
      // OTP verification failed
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying mobile OTP:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addPayment = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log("Received payment method body:", req.body);
    const { type, id, details, userId } = req.body;

    const product = await Product.findById(productId);
    console.log("-========================================-----------", product)
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const payments = {
      id: id,
      type: type,
      details: details,
      userId: userId,
    };

    product.paymentMethods.push(payments);
    await product.save();
    console.log("Payment added successfully to product-----------------------------------------------------:", product);
    res.status(201).json({ message: "Payment added successfully", product });
  } catch (error) {
    console.error("Error adding payment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getPaymentMethodsHandler = async (req, res) => {
  try {
    const productId = req.params.id;
    let paymentMethods;
    console.log("Incoming request for product ID:", productId);
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    paymentMethods = product.paymentMethods.map(method => method.type);
    console.log("Payment methods fetched successfully for product:", paymentMethods);
    res.status(200).json(paymentMethods);
  } catch (error) {
    console.error("Error fetching payment methods:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};





const getPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find();

    res.status(200).json(paymentMethods);
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// const submitAddress = async (req, res) => {
//   try {
//     const { street, city, state, country, zipCode } = req.body;

//     // Your logic to validate and save the shipping address to the database

//     // For example, you can create a new address document in the database
//     const newAddress = new Address({
//       street,
//       city,
//       state,
//       country,
//       zipCode,
//     });

//     await newAddress.save();

//     res.status(201).json({ message: "Shipping address saved successfully" });
//   } catch (error) {
//     console.error("Error submitting address:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };


const submitAddress = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log("Received address submission for product ID:", productId);
    const address = req.body.address; // Assuming address is a single string
    const product = await ProductData.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    console.log("New Address:", address);
    product.address = address; // Assigning the string directly to the 'address' field
    await product.save();
    console.log("Address added successfully to product:", product);
    res.status(201).json({ message: "Address added successfully", product });
  } catch (error) {
    console.error("Error submitting address:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




const getOrderSummary = async (req, res) => {
  try {

    const orderSummary = {
      totalAmount: 100,
    };

    res.status(200).json(orderSummary);
  } catch (error) {
    console.error("Error fetching order summary:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// -----------------------Buy Now--------------------------------


// const updateReview = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.productId);

//     if (product) {
//       const review = product.reviews.id(req.params.reviewId);
//       if (review) {
//         review.rating = req.body.rating || review.rating;
//         review.comment = req.body.comment || review.comment;

//         product.averageRating =
//           product.reviews.reduce((acc, item) => item.rating + acc, 0) /
//           product.reviews.length;

//         await product.save();
//         res.send({ message: "Review updated successfully" });
//       } else {
//         res.status(404).send({ message: "Review not found" });
//       }
//     } else {
//       res.status(404).send({ message: "Product not found" });
//     }
//   } catch (err) {
//     res.status(500).send({
//       message: err.message,
//     });
//   }
// };

// const deleteReview = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.productId);

//     if (product) {
//       const review = product.reviews.id(req.params.reviewId);
//       if (review) {
//         review.remove();
//         product.averageRating =
//           product.reviews.reduce((acc, item) => item.rating + acc, 0) /
//           product.reviews.length || 0;

//         await product.save();
//         res.send({ message: "Review deleted successfully" });
//       } else {
//         res.status(404).send({ message: "Review not found" });
//       }
//     } else {
//       res.status(404).send({ message: "Product not found" });
//     }
//   } catch (err) {
//     res.status(500).send({
//       message: err.message,
//     });
//   }
// };


// -----------------------Reviews--------------------------------
// const addProduct = async (req, res) => {
//   try {
//     const newProduct = new Product({
//       ...req.body,
//       // productId: cname + (count + 1),
//       productId: req.body.productId
//         ? req.body.productId
//         : mongoose.Types.ObjectId(),
//     });

//     await newProduct.save();
//     res.send(newProduct);
//   } catch (err) {
//     res.status(500).send({
//       message: err.message,
//     });
//   }
// };

const addAllProducts = async (req, res) => {
  try {
    // console.log('product data',req.body)
    await Product.deleteMany();
    await Product.insertMany(req.body);
    res.status(200).send({
      message: "Product Added successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getShowingProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "show" }).sort({ _id: -1 });
    res.send(products);
    // console.log("products", products);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  const { title, category, price, page, limit } = req.query;

  let queryObject = {};
  let sortObject = {};
  if (title) {
    const titleQueries = languageCodes.map((lang) => ({
      [`title.${lang}`]: { $regex: `${title}`, $options: "i" },
    }));
    queryObject.$or = titleQueries;
  }

  if (price === "low") {
    sortObject = {
      "prices.originalPrice": 1,
    };
  } else if (price === "high") {
    sortObject = {
      "prices.originalPrice": -1,
    };
  } else if (price === "published") {
    queryObject.status = "show";
  } else if (price === "unPublished") {
    queryObject.status = "hide";
  } else if (price === "status-selling") {
    queryObject.stock = { $gt: 0 };
  } else if (price === "status-out-of-stock") {
    queryObject.stock = { $lt: 1 };
  } else if (price === "date-added-asc") {
    sortObject.createdAt = 1;
  } else if (price === "date-added-desc") {
    sortObject.createdAt = -1;
  } else if (price === "date-updated-asc") {
    sortObject.updatedAt = 1;
  } else if (price === "date-updated-desc") {
    sortObject.updatedAt = -1;
  } else {
    sortObject = { _id: -1 };
  }

  // console.log('sortObject', sortObject);

  if (category) {
    queryObject.categories = category;
  }

  const pages = Number(page);
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  try {
    const totalDoc = await Product.countDocuments(queryObject);

    const products = await Product.find(queryObject)
      .populate({ path: "category", select: "_id name" })
      .populate({ path: "categories", select: "_id name" })
      .sort(sortObject)
      .skip(skip)
      .limit(limits);

    res.send({
      products,
      totalDoc,
      limits,
      pages,
    });
  } catch (err) {
    // console.log("error", err);
    res.status(500).send({
      message: err.message,
    });
  }
};

// const getProductBySlug = async (req, res) => {
//   // console.log("slug", req.params.slug);
//   try {
//     const product = await Product.findOne({ slug: req.params.slug });
//     res.send(product);
//   } catch (err) {
//     res.status(500).send({
//       message: `Slug problem, ${err.message}`,
//     });
//   }
// };

const getProductBySlug = async (req, res) => {
  console.log("Incoming request for slug:", req.params.slug);

  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (product) {
      console.log("Product found:", product);
      res.send(product);
    } else {
      console.log("No product found with the provided slug");
      res.status(404).send({ message: "Product not found" });
    }
  } catch (err) {
    console.log("Error querying database:", err);
    res.status(500).send({
      message: `Slug problem, ${err.message}`,
    });
  }
};


const getProductById = async (req, res) => {
  console.log("Incoming request for id:", req.params.id);
  try {
    const product = await Product.findById(req.params.id)
      .populate({ path: "category", select: "_id, name" })
      .populate({ path: "categories", select: "_id name" });
    console.log("Product found:", product);
    res.send(product);
  } catch (err) {
    console.log("Error querying database:", err);
    res.status(500).send({
      message: err.message,
    });
  }
};

// const updateProduct = async (req, res) => {
//   console.log('update product')
//   console.log('variant', req.params.id)
//   // console.log('variant', res.body.variants)
//   try {
//     const product = await Product.findById(req.params.id);
//     console.log("product", product);

//     if (product) {
//       product.title = { ...product.title, ...req.body.title };
//       product.description = {
//         ...product.description,
//         ...req.body.description,
//       };

//       product.productId = req.body.productId;
//       product.sku = req.body.sku;
//       product.barcode = req.body.barcode;
//       product.slug = req.body.slug;
//       product.categories = req.body.categories;
//       product.category = req.body.category;
//       product.show = req.body.show;
//       product.isCombination = req.body.isCombination;
//       product.variants = req.body.variants;
//       product.stock = req.body.stock;
//       product.prices = req.body.prices;
//       product.image = req.body.image;
//       product.tag = req.body.tag;

//       await product.save();
//       res.send({ data: product, message: "Product updated successfully!" });
//     } else {
//       res.status(404).send({
//         message: "Product Not Found!",
//       });
//     }
//   } catch (err) {
//     res.status(404).send(err.message);
//     // console.log('err',err)
//   }
// };


const updateProduct = async (req, res) => {
  console.log('Update Product Function Called');
  console.log('Variant ID:', req.params.id);
  console.log('Request Body:', req.body);

  try {
    const product = await Product.findById(req.params.id);
    console.log('Product Found:', product);

    if (product) {
      // product.title = { ...product.title, ...req.body.title };
      // product.description = {
      //   ...product.description,
      //   ...req.body.description,
      // };

      product.title = req.body.title;
      product.description = req.body.description;
      product.productId = req.body.productId;
      product.sku = req.body.sku;
      product.barcode = req.body.barcode;
      product.slug = req.body.slug;
      product.categories = req.body.categories;
      product.category = req.body.category;
      product.show = req.body.show;
      product.isCombination = req.body.isCombination;
      product.variants = req.body.variants;
      product.stock = req.body.stock;
      // just mainating the frontends data
      product.stock = req.body.quantity;
      product.price = req.body.price;
      product.originalPrice = req.body.originalPrice;
      // product.image = req.body.image;
      if (Array.isArray(req.body.image)) {
        // Assign the array of images directly
        product.image = req.body.image;
      } else {
        // If it's not an array, convert it into an array with a single element
        product.image = [req.body.image];
      }

      product.tag = req.body.tag;

      console.log('Updated Product:', product);

      await product.save();
      console.log('Product Saved Successfully');
      res.send({ data: product, message: 'Product updated successfully!' });
    } else {
      console.log('Product Not Found!');
      res.status(404).send({ message: 'Product Not Found!' });
    }
  } catch (err) {
    console.error('Error updating product:', err.message);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

const updateManyProducts = async (req, res) => {
  try {
    const updatedData = {};
    for (const key of Object.keys(req.body)) {
      if (
        req.body[key] !== "[]" &&
        Object.entries(req.body[key]).length > 0 &&
        req.body[key] !== req.body.ids
      ) {
        // console.log('req.body[key]', typeof req.body[key]);
        updatedData[key] = req.body[key];
      }
    }

    // console.log("updated data", updatedData);

    await Product.updateMany(
      { _id: { $in: req.body.ids } },
      {
        $set: updatedData,
      },
      {
        multi: true,
      }
    );
    res.send({
      message: "Products update successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateStatus = (req, res) => {
  const newStatus = req.body.status;
  Product.updateOne(
    { _id: req.params.id },
    {
      $set: {
        status: newStatus,
      },
    },
    (err) => {
      if (err) {
        res.status(500).send({
          message: err.message,
        });
      } else {
        res.status(200).send({
          message: `Product ${newStatus} Successfully!`,
        });
      }
    }
  );
};

const deleteProduct = (req, res) => {
  Product.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "Product Deleted Successfully!",
      });
    }
  });
};

const getShowingStoreProducts = async (req, res) => {
  // console.log("req.body", req);
  try {
    const queryObject = {};

    const { category, title, slug } = req.query;
    // console.log("title", title);

    // console.log("query", req.query);

    queryObject.status = "show";

    if (category) {
      queryObject.categories = {
        $in: [category],
      };
    }

    if (title) {
      const titleQueries = languageCodes.map((lang) => ({
        [`title.${lang}`]: { $regex: `${title}`, $options: "i" },
      }));

      queryObject.$or = titleQueries;
    }
    if (slug) {
      queryObject.slug = { $regex: slug, $options: "i" };
    }

    let products = [];
    let popularProducts = [];
    let discountedProducts = [];
    let relatedProducts = [];

    if (slug) {
      products = await Product.find(queryObject)
        .populate({ path: "category", select: "name _id" })
        .sort({ _id: -1 })
        .limit(100);
      relatedProducts = await Product.find({
        category: products[0]?.category,
      }).populate({ path: "category", select: "_id name" });
    } else if (title || category) {
      products = await Product.find(queryObject)
        .populate({ path: "category", select: "name _id" })
        .sort({ _id: -1 })
        .limit(100);
    } else {
      popularProducts = await Product.find(queryObject)
        .populate({ path: "category", select: "name _id" })
        .sort({ sales: -1 })
        .limit(20);

      discountedProducts = await Product.find({
        $or: [
          {
            $and: [
              { isCombination: true },
              {
                variants: {
                  $elemMatch: {
                    discount: { $gt: "0.00" },
                  },
                },
              },
            ],
          },
          {
            $and: [
              { isCombination: false },
              {
                $expr: {
                  $gt: [
                    { $toDouble: "$prices.discount" }, // Convert the discount field to a double
                    0,
                  ],
                },
              },
            ],
          },
        ],
      })
        .populate({ path: "category", select: "name _id" })
        .sort({ _id: -1 })
        .limit(20);
    }

    res.send({
      products,
      popularProducts,
      relatedProducts,
      discountedProducts,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteManyProducts = async (req, res) => {
  try {
    const cname = req.cname;
    // console.log("deleteMany", cname, req.body.ids);

    await Product.deleteMany({ _id: req.body.ids });

    res.send({
      message: `Products Delete Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
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
};
