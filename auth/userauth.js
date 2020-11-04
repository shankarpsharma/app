var { UserModel } = require("../model/signup");
var config=require('../Config/development')
const jwt=require('jsonwebtoken');

exports.requireToken = async (req, res, next) => {
    try {
      const bearHeader = req.headers["authorization"];
      if(!bearHeader){ res.status(401).json({ msg: "accesstoken is not available" });  }
      const token = bearHeader.split(" ")[1];
      if (token === null) {
      
        res.status(401).json({ msg: "accesstoken is not available" });
      } // if there isn't any token
      jwt.verify(token, config.TOKEN_SECRET, (err, result) => {
        //console.log('here');
        if (err) {
          return res.status(403).json({msg : "invalid accesstoken"})
        }
         req.user = result;
         
    //    accesstoken=req.user.accesstoken;
    //     console.log(accesstoken);
  
        next(); // pass the execution off to update middleware
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  