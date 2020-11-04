const {mongoose,conn}=require('../modules/db');

const productModel=mongoose.Schema({
    name:{type:String},
    price:{type:Number},
    description:{type:String,},
    brand:[
    {
    name:{type:String},
    color:{type:String},
    }],
    image:{type:String}
});

exports.productModel=conn.model("product",productModel);