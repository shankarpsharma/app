var { productModel } = require("../model/productModel");
const joi = require("joi");
const { Error } = require("mongoose");
var params=require('params')

exports.getProduct = async (req, res) => {
  try {
    
    productModel.find((err, docs) => {
      if (!err) res.status(400).json({ messsage: docs });

    //   res.status(401).json({ message: console.error.message });
    });
  } catch (error) {
    res.status(400).json({message: error});
  }
};

// --------------------------------------------------------------addproduct--------------

exports.postProduct = async (req, res) => {
  try {
    let { name, price, description,brand } = req.body;
    // const schema = joi.object().keys({
    //   name: joi.string().required(),
    //   price: joi.number().required(),
    //   description: joi.string().required(),
    //   // brand:joi.string()
    // });
    // const result = schema.validate(req.body, { abortEarly: true });
    let isProduct = await productModel.find({ "brand.name":"samsung" });
    console.log(isProduct);
    if (isProduct) {
      throw new Error(`${isProduct} exixts`);
    }

    let product = { name, price, description,brand };
    let saveProduct = await productModel.create(product);

    if (!saveProduct) {
      throw new Error("product unable to save");
    }
    res.status(400).json({ message: saveProduct });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

//-------------------------deleteproduct------------------------------------------------//


exports.productDelete = async (req, res) => {
  try {
  let deleteProduct= await  productModel.findByIdAndRemove(req.body.id||req.params.id);
  if(deleteProduct){
    res.status(400).json({message :"product deleted succesfully",deletedproduct:deleteProduct})
  }else{
    res.status(400).json({message:"product already deleted"})
  }

  } catch(error) {
    res.status(400).json(error.message);
  }
};

//------------------------------updateproduct-------------------------------------//

exports.updateProduct = async (req, res) => {

try {
    let updatedproduct = await productModel.findByIdAndUpdate(
      
       req.body.id||req.params.id,
       { $set:req.body},
       {new: true }
     );
        
       res.status(200).json({
       status: 1,
       message: "profile updated successfully",
       productdata: updatedproduct,
     });
   } catch (error) {
      res.status(401).json({ status: 0, message: error.message });
   }
 };