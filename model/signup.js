const { mongoose, conn } = require("../modules/db");
const userSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
   // unique: true
  },
  password: {
    type: String,
    required: true
  },
  country_code:{
    type:Number,
    required:true
  },
  mobile_number:{
    type:Number,
    required:true
  }, 
  access_token:{
    type:String,
    default:null
  },
  admin:{
    type:Boolean,
    default:false
  },
  blocked:{
    type:Number,
    default:false
  }
});
exports.UserModel = conn.model("users", userSchema);
