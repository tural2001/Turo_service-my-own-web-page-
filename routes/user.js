const express=require("express");
const router=express.Router();

const db=require("../data/db")

const userController=require("../controllers/user");

router.get("/products/category/:slug", userController.products);

router.get("/products/:slug",  userController.products_detail);

router.get("/products", userController.products);

router.get("/", userController.index);

module.exports=router;  