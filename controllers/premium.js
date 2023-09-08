const User = require("../models/userInfo.js");

const Expense = require("../models/expenses.js");

exports.leaderboard = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });

    if (user.isPremium === false) {
      res.json({ isPremium: false, message: "user is not a premium" });
      return;
    }

    User.find()
      .select("name expense")
      .then((result) => {
       // console.log(result);

        res.status(200).json(result);
      });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
