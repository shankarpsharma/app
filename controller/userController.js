var { UserModel } = require("../model/signup");
var md5 = require("md5");
const joi = require("joi");
var comFunc=require('../modules/commonFuns');
const { Error } = require("mongoose");
var params=require('params')

exports.user_signUp = async (req, res) => {
  try {
    let {
      first_name,
      last_name,
      email,
      mobile_number,
      password,
      country_code,
      admin
    } = req.body;
    const schema = joi.object().keys({
      email: joi.string().required(),
      first_name: joi.string().required(),

      last_name: joi.string().required(),

      password: joi.string().min(2).max(10).required(),

      mobile_number: joi.number().required(),

      country_code: joi.number().required(),

      admin:joi.boolean().required()
    });
    const result = schema.validate(req.body, { abortEarly: true });
    if (result.error) {
      throw new Error(result.error);
      
    }
    // res.status(200).json({ message: "validation passed", data: req.body });

    password = md5(password);
    email=email.toLowerCase();
    // var otp=1234;
    
    let mobileExist=await UserModel.findOne({country_code,mobile_number});
    if(mobileExist){
      throw new Error("mobile no already registerd!!");
    }
    let checkMail = await UserModel.findOne({ email });
    if (checkMail) {
      throw new Error("mail already registerd!!");
    } 
      
   // let access_token=comFunc.generateAcessToken(10);
    // let message="your otp is:"+ otp
    // console.log(message)
   
    //await comFunc.sendotp(message,country_code+mobile_number)
     
    var save = {
        first_name,
        last_name,
        email,
        mobile_number,
        country_code,
        password,
        admin
      };
      console.log(save);
      var user = await UserModel.create(save);
      return res.status(200).json({ message: "succeed at mission" ,user});
      // var user_update = await user.save();
      // if (user_update) {
      //   res.status(200).json({
      //     message: "account is created",
      //     response: user_update,
      //   });
      // }
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$0000000000 $$$$444login$$$$$$$$$$$$$$$$$$$//


exports.user_login = async (req, res,next) => {
  try {
    const schema = joi.object().keys({
      email: joi.string().required(),
      password: joi.string().required()
    });
    const result = schema.validate(req.body, { abortEarly: true });
    // if (result.error) {
    //   throw new Error(result.error);
    // }

    let { email, password, access_token } = req.body;
    password = md5(password);

    let checkUser = await UserModel.findOne({email,password });
    //console.log(checkUser,"here")
    if(checkUser.blocked===0){
    if (checkUser) {
      console.log(checkUser);
      access_token = comFunc.generateToken(checkUser);
      
      checkUser = await UserModel.findOneAndUpdate(
        { _id: checkUser._id },
        { access_token },
        { new: true }
      );
      res.status(200).json({ message: "user succesfully loged", userdetails: checkUser });
      console.log(checkUser);
      next();
    } 
    else {
     // throw new Error("not matched ");
     res.status(201).json({message:"not matched"})
      
    }
  }else{
    res.status(400).json({message:"Unable to login because user is blocked by admin!!!"})
  }
  } catch (error) {
    res.status(400).json({ message: console.error.message });
  }
};





exports.updateprofile = async (req, res) => {

   //res.status(200).json({message:'accesstoken passed'})

  try {
   // console.log("hi");
    const schema = joi.object().keys({
      email: joi.string(),
      first_name: joi.string(),

      last_name: joi.string(),

      password: joi.string(),

      mobile_number: joi.number(),

      country_code: joi.string()
    });
  //  // console.log(schema);

    let result = schema.validate(req.body,{abortEarly:true});
   
    if (result.error) {
      throw new Error(result.error);
      
    }
        
    let updateddata = await UserModel.findOneAndUpdate(
     
      req.body.id||req.params.id,
      { $set:req.body},
      {new: true }
    );
        console.log(updateddata);
      res.status(200).json({
      status: 1,
      message: "profile updated successfully",
      userdata: updateddata,
    });
  } catch (error) {
     res.status(401).json({ status: 0, message: error.message });
  }
};


exports.deleteUser=async (req,res)=>{
  try{
let deleteuser=await UserModel.findByIdAndRemove(req.body._id||req.params.id)
if(deleteuser){
  res.status(400).json({message:"user deleted succesfully",deleteduser:deleteuser})
}else{
  res.status(400).json({message:"not be able to delete"})
}
  }catch(error){
    res.status(401).json({ status: 0, message: error.message });
  }
}
 
exports.forgetPassword=async (req,res)=>{
  try{
    res.send('<form action="/passwordreset" method="POST">' +
        '<input type="email" name="email" value="" placeholder="Enter your email..." />' +
        '<input type="submit" value="Reset Password" />' +
    '</form>');
  }catch(error){
   // res.status(400).json({message:error})
   console.log(error)
  }
}

exports.resetPassword=async(req,res)=>{
  try{
//console.log(req.body);
let {email,user_id,password}=req.body;


let userdata=await UserModel.find({email:email})
console.log(userdata)
console.log(userdata[0]._id,"here")
  if(userdata){
    res.status(400).json("reset password")
}
let samepasswrd= await UserModel.findOne({_id:user_id,password:md5(password)})
if(samepasswrd){
  throw new Error("new password cant be same!!!")
}

userdata = await UserModel.findOneAndUpdate({_id:user_id},{password:md5(password)})
if(userdata){
  res.status(200).json({message:"Password updated successfully"});
}
else{
  throw new Error("user not matched");
}
  }catch(error){
    //console.log("here")
    res.status(400).json({message: error.message });
  }
}



exports.getUser=async (req,res,next)=>{
  try{
    let allUser=await UserModel.find({})
    if(allUser){
      res.status(400).json({status:0,message:"user are:",allUser})
      next();
    }
    res.status(400).json({message:"no users"});
  }catch(error){
    res.status(400).json({message:error.message})
  }
}

exports.getUserById=async (req,res)=>{
  try{
    let userid=await UserModel.findById(req.body.id||req.params.id)
    if(userid){
      res.status(400).json({message:"user is:",userid})
    }
    res.status(400).json({message:"no such user exist"});
  }catch(error){
    res.status(400).json({message:error.message})
  }
}

exports.blockUser=async (req,res)=>{
  try{
    
    //console.log(req)
    console.log(req.body.id,"bbbb")
    let blockuser=await UserModel.findByIdAndUpdate(req.body.id,{$set:{blocked:true}},{new:true})
    console.log(blockuser,"aaaaa")
    if(blockuser){
      res.status(200).json({
				message: 'User is Blocked successfully',
				responce: blockuser
      })
   }else{
    res.status(400).json({
			message: 'Unable to block User'
		});
   }
}catch(error){
  res.status(400).json({message:error.message});
}
}