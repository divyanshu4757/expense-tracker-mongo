const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const User = require("../models/userInfo.js");



const Forgot = require("../models/forgotpasswordrequests.js");

exports.forgotpassword = async (req, res, next) => {
  console.log("lemon");
  try {
    const receivedEmail = req.body.email;

    const checkEmail = await User.findOne({
     email: receivedEmail 
    });

    if (checkEmail) {
      const Sib = require("sib-api-v3-sdk");
      require("dotenv").config();

      const client = Sib.ApiClient.instance;

      const apiKey = client.authentications["api-key"];
      apiKey.apiKey = process.env.API_KEY;

      const tranEmailApi = new Sib.TransactionalEmailsApi();

      const sender = {
        email: "guptadivyanshu4757@gmail.com",
      };

      const receivers = [
        {
          email: req.body.email,
        },
      ];

      const forgot = new Forgot({
        
        isActive: true,
        userId: checkEmail._id,
      });

    const password =   await forgot.save()
    console.log(password);

    const _id = password._id.toString();
      const confirmationEmailSent = await tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: "reset password ",
        htmlContent: `your reset password has been sent to you <a href="http://localhost:5000/password/resetpassword/${_id}">Reset Password</a> `,
      });

      res.status(200).send("An email has been sent");
    } else {
      throw new Error("email not found");
    }
  } catch (err) {
    console.log(err.message);
    res.status(404).send(err.message);
  }

  /*
    
        .then(data=>{
            console.log(data)
        res.send("email is sent to You");
    
        })
    
        */
};



exports.resetpassword = async (req, res) => {
  const id = req.params.id;

  const forgotRequest = await Forgot.findOne({
    _id: id 
  });

  if (forgotRequest) {
    if (forgotRequest.isActive == true) {
      res.status(200).send(`
      <html>
          <script>
                                          
          </script>
          <form action="/password/updatepassword/${id}" method="get">
          <label for="newpassword">Enter New password</label>
          <input name="newpassword" type="password" required></input>
          <button>reset password</button>
          </form>
          </html>
      `);
      res.end();
    }
  }
};

exports.updatepassword = async (req, res) => {
  const id = req.params.id;
  console.log(id);

  const new_password = req.query.newpassword;

  console.log(new_password);
  const forgotRequest = await Forgot.findOne({
      _id: id 
     });

  console.log(forgotRequest);

  const userId = forgotRequest.userId;

  if (userId) {
    bcrypt.hash(new_password, 10, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        User
          .findOne({  _id: userId })
          .then(async(user) => {
            user.password = result;
           await user.save();
            res.status(200).json({ message: "successfully updated password" });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  } else {
    res.status(404).json({ error: "No user Exists", success: false });
  }
};
