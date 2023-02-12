const express=require("express");
const router=express.Router();

const authController=require("../controllers/auth");
const csrf = require("../middlewares/csrf");

router.get("/register",csrf,authController.get_register);
router.post("/register",csrf,authController.post_register);

router.get("/login",csrf,authController.get_login);
router.post("/login",authController.post_login);

router.get("/reset-password",csrf,authController.get_reset_password);
router.post("/reset-password",authController.post_reset_password);

router.get("/new-password/:token",csrf,authController.get_new_password);
router.post("/new-password",authController.post_new_password);

router.get("/logout",csrf,authController.get_logout);

module.exports=router;

