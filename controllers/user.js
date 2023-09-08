require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const User = require("../models/userInfo.js");
const Expense = require("../models/expenses.js");
const Download= require("../models/downloads.js");




exports.signUp = async(req, res, next) => {
  const body = req.body;

  
 const user_exists =await   User.findOne({email:req.body.email})

  if(user_exists) {
    res.json({ success: false });
  }
  else{
    bcrypt.hash(body.password, 10, (err, hash) => {
            const user = new User({
                name: body.name,
                email: body.email,
                password: hash,
              })
              user.save()
              .then((result)=>{
             //   console.log(result)
               res.json({ success: true });
             
              })
              .catch((err) => {
                console.log(err)
              })
            
            })
         
  }

};


function generateAccessToken(id) {
  const token = jwt.sign({ userId: id }, "myToken");
  return token;
}

exports.login =async (req, res, next) => {
  const body = req.body;

   
 const user =await   User.findOne({email:req.body.email})

 if(user) {
 //  console.log(user);
     bcrypt.compare(
        req.body.password,
        user.password,
        (err, response) => {
          // console.log(response);
          const id = user._id.toString();
          //console.log(id );
          const token = generateAccessToken(id);

          if (err) {
            res.status(500).send("something went wrong");
          }

          if (response === true) {
            res.json({ id: token });
          } else if (response === false) {
            res.status(401).send("User not authorised");
          }
        }
      );

 }

};


exports.postExpenses = async (req, res, next) => {
  
  const incomingData = req.body;
  const id = req.userId;
  console.log(id);

  const expense = new Expense({
    amount: incomingData.amount,
    category: incomingData.category,
    description: incomingData.description,
    userId: id,
  })

  expense.save()
  .then((result)=>{
   // console.log(result);
    console.log('expense saved')
      res.json({ data:result});

   })
   .catch(err => {
    console.log(err)
    res.status(500).json({
          success: false,
          error: err,
        });
   })


   User.findById(id)
   .then((user)=>{

    const previousExpense = user.expense;
    user.expense =parseInt(previousExpense) + parseInt(incomingData.amount);
    user.save();
   })
   .catch((err)=>{
    console.log(err);
   })

};


exports.getExpenses = async (req, res, next) => {
  const userid = req.userId;
  console.log(userid);

  const page = parseInt(req.query.page);
  console.log(page);

  const limit = parseInt(req.query.limit);

  const offset = (page - 1) * limit;
  const totalCount = await Expense.countDocuments({ userId: userid });
 
  console.log(totalCount)
  Expense
    .find( { userId: userid })
    .skip(offset)
    .limit(limit)
    .then((expenseResults)=>{
     
   //   console.log(expenseResults)
     
      res.json({ pureResult: expenseResults, count: totalCount });

      
    })
    .catch(err=>{
      console.log(err);
    })
};



exports.deleteExpense = async (req, res, next) => {
  const id = req.params.id;
//  console.log(id);
  //const userid = req.userId;
 
  
    Expense.findByIdAndRemove(id)
    .then(()=>{
      console.log('destroyed product');
      res.json({ message: "Expense deleted" });

    })
    .catch(err=>{
   res.status(500).json({ message: "Error deleting expense" });
    })
};















function uploadToS3(data, fileName, res, id) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
 
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET =process.env.IAM_USER_SECRET;

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: data,
    ACL: "public-read",
  };
  s3bucket.upload(params, (err, response) => {
    if (err) {
      console.log("something went wrong", err);
    } else {
      res.status(200).json({ fileURL: response.Location, success: true });
      const download = new Download({
        url: response.Location,
        userId:id,
      })
        
      download.save()
        .then((res) => console.log("success"))
        .catch((err) => console.log(err));
    }
  });
}

exports.download = async (req, res) => {
  try {
    const id = req.userId;
    console.log(id);

    const expenses = await Expense.find({ userId: id });
   // console.log(expenses);
    const stringfiedExpenses = JSON.stringify(expenses);
   // console.log(stringfiedExpenses);

    //it should depend upon userId
     const fileName = `Expenses${id}/${new Date()}.txt`;
     uploadToS3(stringfiedExpenses, fileName, res, id);
   } catch (err) {
  console.log(err);
     res.status(500).json({ fileURL: "", success: false, error: err });
   }
};










exports.previousdownloads = (req, res, next) => {
  const id = req.userId;

  Download.find({userId: id }).then((response) => {
  //  console.log(response)
    res.json({ response });
  });

}