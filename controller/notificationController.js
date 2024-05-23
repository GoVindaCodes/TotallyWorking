const Notification = require("../models/Notification");

// const addNotification = async (req, res) => {
//   try {
//     if (req.body.productId) {
//       const isAdded = await Notification.findOne({
//         productId: req.body.productId,
//       });
//       if (isAdded) {
//         return res.end();
//       } else {
//         const newNotification = new Notification(req.body);
//         await newNotification.save();
//         res.status(200).send({
//           message: "Notification save successfully!",
//         });
//       }
//     } else {
//       const newNotification = new Notification(req.body);
//       await newNotification.save();
//       res.status(200).send({
//         message: "Notification save successfully!",
//       });
//     }
//   } catch (err) {
//     res.status(500).send({
//       message: err.message,
//     });
//   }
// };

// const addNotification = async (req, res) => {
//   try {
//     console.log("Received request to add notification:", req.body);

//     if (req.body.productId) {
//       console.log("Checking if notification already exists for productId:", req.body.productId);

//       const isAdded = await Notification.findOne({
//         productId: req.body.productId,
//       });

//       if (isAdded) {
//         console.log("Notification already exists for productId:", req.body.productId);
//         return res.end();
//       } else {
//         console.log("Creating new notification for productId:", req.body.productId);

//         const newNotification = new Notification(req.body);
//         await newNotification.save();

//         console.log("Notification saved successfully for productId:", req.body.productId);

//         res.status(200).send({
//           message: "Notification saved successfully!",
//         });
//       }
//     } else {
//       console.log("Creating new notification without productId");

//       const newNotification = new Notification(req.body);
//       await newNotification.save();

//       console.log("Notification saved successfully without productId");

//       res.status(200).send({
//         message: "Notification saved successfully!",
//       });
//     }
//   } catch (err) {
//     console.error("Error adding notification:", err);

//     res.status(500).send({
//       message: err.message,
//     });
//   }
// };

const addNotification = async (req, res) => {
  try {
    console.log("Received request to add notification:", req.body);
    if (!req.body.message) {
      throw new Error("Notification message is required.");
    }
    if (req.body.productId) {
      console.log("Checking if notification already exists for productId:", req.body.productId);
      const existingNotification = await Notification.findOne({ productId: req.body.productId });
      if (existingNotification) {
        console.log("Notification already exists for productId:", req.body.productId);
        return res.status(200).send({ message: "Notification already exists for productId." });
      }
    }
    console.log("Creating new notification for productId:", req.body.productId);
    const newNotification = new Notification(req.body);
    await newNotification.save();
    console.log("Notification saved successfully.");
    res.status(200).send({ message: "Notification saved successfully." });
  } catch (error) {
    console.error("Error adding notification:", error);
    res.status(500).send({ message: error.message });
  }
};



// const addNotification = async (req, res) => {
//   try {
//     // Define your dummy notification data
//     const dummyNotification = {
//       orderId: "dummyOrderId",
//       productId: "dummyProductId",
//       adminId: "dummyAdminId",
//       message: "This is a dummy notification message.",
//       image: "https://example.com/dummy-image.jpg",
//       status: "unread",
//     };

//     // Check if the dummy notification already exists
//     const isAdded = await Notification.findOne({
//       productId: dummyNotification.productId,
//     });

//     // If the dummy notification already exists, return without saving
//     if (isAdded) {
//       return res.end();
//     }

//     // Create a new Notification instance with the dummy notification data
//     const newNotification = new Notification(dummyNotification);

//     // Save the new notification to the database
//     await newNotification.save();

//     // Send a success response
//     res.status(200).send({
//       message: "Notification saved successfully!",
//     });
//   } catch (err) {
//     // Handle errors
//     res.status(500).send({
//       message: err.message,
//     });
//   }
// };

// const getAllNotification = async (req, res) => {
//   try {
//     const { page } = req.query;

//     const pages = page;
//     const limits = 5;
//     const skip = (pages - 1) * limits;
//     const totalDoc = await Notification.countDocuments();
//     const totalUnreadDoc = await Notification.countDocuments({
//       status: "unread",
//     });
//     const notifications = await Notification.find({
//       status: { $in: ["read", "unread"] },
//     })
//       .sort({
//         _id: -1,
//       })
//       .skip(skip)
//       .limit(limits);

//     res.send({ totalDoc, totalUnreadDoc, notifications });
//   } catch (err) {
//     res.status(500).send({
//       message: err.message,
//     });
//   }
// };


// const getAllNotification = async (req, res) => {
//   console.log("Fetching all notifications", req.body);
//   try {
//     console.log("Fetching all notifications");

//     const { page } = req.query;

//     const pages = page;
//     const limits = 5;
//     const skip = (pages - 1) * limits;
//     const totalDoc = await Notification.countDocuments();
//     const totalUnreadDoc = await Notification.countDocuments({
//       status: "unread",
//     });
//     const notifications = await Notification.find({
//       status: { $in: ["read", "unread"] },
//     })
//       .sort({
//         _id: -1,
//       })
//       .skip(skip)
//       .limit(limits);

//     console.log("Notifications fetched successfully:", notifications);
//     res.send({ totalDoc, totalUnreadDoc, notifications });
//   } catch (err) {
//     console.error("Error fetching notifications:", err);
//     res.status(500).send({
//       message: err.message,
//     });
//   }
// };

const getAllNotification = async (req, res) => {
  console.log("Fetching all notifications");
  try {
    console.log("Request body:", req.body);

    const { page } = req.query;

    const pages = page;
    const limits = 5;
    const skip = (pages - 1) * limits;
    const totalDoc = await Notification.countDocuments();
    const totalUnreadDoc = await Notification.countDocuments({
      status: "unread",
    });
    const notifications = await Notification.find({
      status: { $in: ["read", "unread"] },
    })
      .sort({
        _id: -1,
      })
      .skip(skip)
      .limit(limits);

    console.log("Notifications fetched successfully:", notifications);
    res.send({ totalDoc, totalUnreadDoc, notifications });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).send({
      message: "An error occurred while fetching notifications.",
      error: err.message
    });
  }
};


const updateStatusNotification = async (req, res) => {
  try {
    const newStatus = req.body.status;

    await Notification.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      }
    );
    const totalDoc = await Notification.countDocuments({ status: "unread" });

    res.send({
      totalDoc,
      message: `Notification Read!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateManyStatusNotification = async (req, res) => {
  try {
    await Notification.updateMany(
      { _id: { $in: req.body.ids } },
      {
        $set: {
          status: req.body.status,
        },
      },
      {
        multi: true,
      }
    );

    res.send({
      message: "Notification update successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// const deleteNotificationById = async (req, res) => {
//   try {
//     Notification.deleteOne({ _id: req.params.id }, (err) => {
//       if (err) {
//         res.status(500).send({
//           message: err.message,
//         });
//       } else {
//         res.send({
//           message: "Notification deleted successfully!",
//         });
//       }
//     });
//   } catch (err) {
//     res.status(500).send({
//       message: err.message,
//     });
//   }
// };

const deleteNotificationById = async (req, res) => {
  try {
    console.log("Deleting notification with ID:", req.params.id);

    Notification.deleteOne({ _id: req.params.id }, (err) => {
      if (err) {
        console.error("Error deleting notification:", err);
        res.status(500).send({
          message: err.message,
        });
      } else {
        console.log("Notification deleted successfully!");
        res.send({
          message: "Notification deleted successfully!",
        });
      }
    });
  } catch (err) {
    console.error("Error deleting notification:", err);
    res.status(500).send({
      message: err.message,
    });
  }
};


const deleteNotificationByProductId = async (req, res) => {
  try {
    Notification.deleteOne({ productId: req.params.id }, (err) => {
      if (err) {
        res.status(500).send({
          message: err.message,
        });
      } else {
        res.send({
          message: "Notification deleted successfully!",
        });
      }
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteManyNotification = async (req, res) => {
  try {
    await Notification.deleteMany({ _id: req.body.ids });

    res.send({
      message: `Notification Delete Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  getAllNotification,
  addNotification,
  updateStatusNotification,
  deleteNotificationById,
  deleteNotificationByProductId,
  updateManyStatusNotification,
  deleteManyNotification,
};
