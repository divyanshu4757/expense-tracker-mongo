require("dotenv").config();

const Razorpay = require("razorpay");
const Order = require("../models/orders");
const User = require("../models/userInfo.js");

exports.purchasepremium = async (req, res) => {
  //   console.log(req.userId);

  var rzp = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const amount = 25000;

  rzp.orders.create({ amount, currency: "INR" }, (err, result) => {
    // console.log(order);
    if (err) {
      res.status(403).json({ message: "something went wrong", error: true });
    }

    const order = new Order({
      orderid: result.id,
      status: "pending",
      userId: req.userId,
    });

    order
      .save()
      .then((result) => {
        //console.log(result);
        return res.status(200).json({ result, key_id: rzp.key_id });
      })
      .catch((err) => {
        res.status(403).json({ message: "something went wrong", error: true });
      });
  });
};

exports.transactionstatus = (req, res) => {
 // console.log(req.userId);

  const { payment_id, order_id } = req.body;
 // console.log(payment_id);

  const orderPromise = Order.findOne({ orderid: order_id }).then((order) => {
    order.paymentid = payment_id;
    order.status = "confirmed";
    return order.save();
  });

  const userPromise = User.findOne({ _id: req.userId }).then((user) => {
 //   console.log(user);
    user.isPremium = true;
    return user.save();
  });

  Promise.all([orderPromise, userPromise])
    .then(() => {
      res
        .status(202)
        .json({ success: true, message: "Transaction Successful" });
    })
    .catch((err) => {
      res.status(403).json({ message: "Something went wrong", error: true });
    });
};
