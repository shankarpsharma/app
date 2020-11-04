var express=require("express");
var router=express.Router();
var userController=require("../controller/userController")
var prodController=require("../controller/productController");
var comFunction=require('../modules/commonFuns')
var auth=require("../auth/userauth")


router.post("/signup", userController.user_signUp);
router.post("/login",userController.user_login);
router.put("/userupdate/:id",auth.requireToken,userController.updateprofile);
router.delete("/userdelete/:id",auth.requireToken,userController.deleteUser);
router.get("/forgetPass",userController.forgetPassword);
router.post("/passwordreset",userController.resetPassword);
router.get("/getUser",auth.requireToken,comFunction.verifyAdmin,userController.getUser);
router.get("/getuserbyid",userController.getUserById);     
router.post("/blockuser",auth.requireToken,comFunction.verifyAdmin,userController.blockUser);

router.post('/addProduct',prodController.postProduct);
router.get('/getProduct',prodController.getProduct);
router.delete('/deleteProduct/:id',prodController.productDelete);
router.put('/updateProd/:id',prodController.updateProduct);

router.get("/getUser",auth.requireToken,comFunction.verifyAdmin,userController.getUser)


module.exports=router;
