const express=require("express")
const router=express.Router();

const db=require("../data/db");
const adminController=require("../controllers/admin") ;

const imageUpload=require("../helpers/image-upload");
const csrf = require("../middlewares/csrf");
const isAdmin = require("../middlewares/is-admin");
const isModerator = require("../middlewares/is-moderator");

 
router.get("/product/delete/:productid",csrf,isModerator, adminController.get_product_delete);
router.post("/product/delete/:productid",isModerator, adminController.post_product_delete);

router.get("/category/delete/:categoryid",csrf,isAdmin, adminController.get_category_delete);

router.post("/category/delete/:categoryid",isAdmin, adminController.post_category_delete);

router.get("/product/create",isModerator,csrf, adminController.get_product_create );

router.post("/categories/remove",isAdmin,adminController.get_category_remove);

router.post("/product/create",isModerator,csrf, imageUpload.upload.single("sekil"), adminController.post_product_create);

router.get("/category/create",isAdmin,csrf, adminController.get_category_create);

router.post("/category/create",isAdmin, adminController.post_category_create);

router.get("/products/:productid",isModerator,csrf, adminController.get_product_edit);

router.post("/products/:productid",isModerator, imageUpload.upload.single("sekil"), adminController.post_product_edit);

router.get("/categories/:categoryid",isAdmin,csrf, adminController.get_category_edit);

router.post("/categories/:categoryid",isAdmin, adminController.post_category_edit);

router.get("/products",isModerator, adminController.get_products);

router.get("/categories",isAdmin, adminController.get_categories);
 
router.get("/roles",isAdmin,adminController.get_roles);
router.get("/roles/:roleid",isAdmin,csrf,adminController.get_role_edit);
router.post("/roles/remove",isAdmin,csrf,adminController.roles_remove);
router.post("/roles/:roleid",isAdmin,csrf,adminController.post_role_edit);

router.get("/users",isAdmin,adminController.get_user);
router.get("/users/:userid",isAdmin,csrf,adminController.get_user_edit);
router.post("/users/:userid",isAdmin,csrf,adminController.post_user_edit);


module.exports=router;