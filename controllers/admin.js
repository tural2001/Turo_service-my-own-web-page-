const Product=require("../models/product");
const Category=require("../models/category");
const Role=require("../models/role");
const User=require("../models/user");

const sequelize=require("../data/db");
const { Op, }=require("sequelize");
const fs=require("fs");
const slugField=require("../helpers/slugfield");
const { userInfo } = require("os");
const e = require("express");


exports.get_product_delete = async (req,res)=>{
    const productid=req.params.productid;
    const userid=req.session.userid;
 
    const isAdmin=req.session.roles.includes("admin");


    try{
        const product=await Product.findOne({
            where: isAdmin ? {id:productid} : {id:productid,userId:userid}});

        res.render("admin/product-delete",{
            product:product
        })
    }
    catch(err){
        console.log(err);
    };
}

exports.post_product_delete = async (req,res)=>{
    const productid=req.body.productid;

    try{
        const product=await Product.findByPk(productid);
        if(product){
            await product.destroy();
            res.redirect("/admin/products?action=delete");
        }
        res.redirect("/admin/products");

    }
    catch(err){
        console.log(err);
    }
}

exports.get_category_delete = async (req,res)=>{
    const categoryid=req.params.categoryid;

    try{
        const category=await Category.findByPk(categoryid);

        res.render("admin/category-delete",{
            category:category
        })
    }
    catch(err){
        console.log(err);
    };
}

exports.post_category_delete = async (req,res)=>{
    const categoryid=req.body.categoryid;

    try{
        await Category.destroy({
            where: {
              id: categoryid
            }
          });
         res.redirect("/admin/categories?action=delete");
    }
    catch(err){
        console.log(err);
    }
}

exports.get_product_create = async (req, res)=> {
    try{
         const categories =await Category.findAll();
        res.render("admin/product-create",{
            categories:categories
        });
    }
    catch(err){
        console.log(err)
    }
}

exports.post_product_create = async (req,res)=>{ 
    const ad=req.body.ad;
    const haqqinda=req.body.haqqinda;
    const qiymet=req.body.qiymet;
    const anasayfa=req.body.anasayfa =="on"?1:0;
    const onay=req.body.onay =="on"?1:0;
    const kategoriya=req.body.kategoriya;
    const userid=req.session.userid;
    let sekil="";

    try{

        if(ad==""){
            throw new Error("ad bosluq ola bilmez");
        }


        if(req.file){
            sekil=req.file.filename;

            fs.unlink("./public/images"+req.body.sekil, err=>{
                console.log(err);
            });

        }
         await Product.create({
            ad:ad,
            url:slugField(ad),
            haqqinda:haqqinda,
            sekil:sekil,
            qiymet:qiymet,
            anasayfa:anasayfa,
            onay:onay,
            categoryId:kategoriya,
            userId:userid
         })
        res.redirect("/admin/products?action=create");
    }
    catch(err){

    let xetaMesaji="";

    if(err instanceof Error){
        xetaMesaji += err.message;

        res.render("admin/product-create",{
            categories:await Category.findAll(),
            message:{text:xetaMesaji,class:"danger"},
            values:{
                ad:ad
            }
        });
    }
    }
}

exports.get_category_create = async (req, res)=> {
    try{
        res.render("admin/category-create",{
        });
    }
    catch(err){
        console.log(err)
    }
}

exports.post_category_create = async (req,res)=>{
    const ad=req.body.ad;

    try{
        await Category.create({ad:ad});
        res.redirect("/admin/categories?action=create");
    }
    catch(err){
        console.log(err);
    }

}

exports.get_product_edit = async (req, res)=> {
    const productid=req.params.productid
    const userid=req.session.userid;

    const isAdmin=req.session.roles.includes("admin");

    try{
        const product=await Product.findOne({
            where: isAdmin ? {id:productid} : {id:productid,userId:userid},
            include:{
                model:Category,
                attributes:["id"]
            }
        });
        const categories=await Category.findAll();

        if(product){
        return    res.render("admin/product-edit",{
            product:product,
            categories:categories
        })
        }
        res.redirect("admin/products");
    }
    catch(err){
        console.log(err);
    }
}

exports.post_product_edit = async (req, res)=> {
    const productid=req.body.productid;
    const ad=req.body.ad;
    const haqqinda=req.body.haqqinda;
    const qiymet=req.body.qiymet;
    const kategoriIds=req.body.categories;
    const url=req.body.url;
    const userid=req.session.userid;



    let sekil=req.body.sekil;
    

    if(req.file){
        sekil=req.file.filename;
        
        fs.unlink("./public/images/"+req.body.sekil, err=>{
            console.log(err);
    });
    }

    const anasayfa=req.body.anasayfa=="on"?1:0;
    const onay=req.body.onay=="on"?1:0;

    try{
        const product=await Product.findOne({
            where: isAdmin ? {id:productid} : {id:productid,userId:userid},
            include:{
                model:Category,
                attributes:["id"]
            }
        });
        if(product){
            product.ad=ad;
            product.url=url,
            product.haqqinda=haqqinda;
            product.qiymet=qiymet;
            product.sekil=sekil;
            product.anasayfa=anasayfa;
            product.onay=onay;

            if(kategoriIds == undefined){
                await product.removeCategories(product.categories);
            }else{
                await product.removeCategories(product.categories);
                const selectedCategories=await Category.findAll({
                    where:{
                        id:{
                            [Op.in]:kategoriIds
                        }
                    }
                })
                await product.addCategories(selectedCategories);
            }

            await product.save();
            return res.redirect("/admin/products?action=edit&productid="+productid)
        }
        res.redirect("/admin/products")


    }
    catch(err){
        console.log(err);
    }

}

exports.get_category_remove = async (req,res)=>{
    const productid=req.body.productid;
    const categoryid=req.body.categoryid;

    await sequelize.query(`delete from productCategories where productId=${productid} and categoryId=${categoryid}`);
    res.redirect("/admin/categories/"+categoryid);
}

exports.get_category_edit = async (req, res)=> {
    const categoryid=req.params.categoryid

    try{

        const category=await Category.findByPk(categoryid);
        const products=await category.getProducts();
        const countProduct=await category.countProducts();
        if(category){
        return    res.render("admin/category-edit",{
            category:category,
            products:products,
            countProduct: countProduct
        })
        }
        res.redirect("admin/categories");
    }
    catch(err){
        console.log(err);
    }
}

exports.post_category_edit = async (req, res)=> {
    const categoryid=req.params.categoryid;
    const ad = req.body.ad;

    try{
        await Category.update({ad:ad},{
            where:{
                id:categoryid
            }
        });
        return res.redirect("/admin/categories?action=edit&categoryid=" + categoryid);
    }
    catch(err){
        console.log(err);
    }
}

exports.get_products = async (req, res)=> {
    const userid=req.session.userid;
    const isModerator=req.session.roles.includes("moderator");
    const isAdmin=req.session.roles.includes("admin");

    try{
        const products =await Product.findAll({
            attributes:["id","ad","sekil","qiymet"],
            include:{ 
                model:Category,
                attributes:["ad"]
            },
            where: isModerator && !isAdmin ? {userId:userid}: null
        });
        res.render("admin/product-list",{
            products:products,
            action:req.query.action,
            productid:req.query.productid
        })
    }
    catch(err){
        console.log(err)
    }
}

exports.get_categories = async (req, res)=> {
    try{
        const categories=await Category.findAll();
        res.render("admin/category-list",{
            categories:categories,
            action:req.query.action,
            categoryid:req.query.categoryid
        })
    }
    catch(err){
        console.log(err)
    }
}   


exports.get_roles = async (req, res)=> {
    try{

        const roles=await Role.findAll({
            attributes:{
                include:['role.id','role.rolename',[sequelize.fn('COUNT',sequelize.col('users.id')),'user_count']]
            },
            include:[{
                model: User, attributes:['id']}
            ],
            group:['role.id'],
            raw:true,
            includeIgnoreAttributes:false
        })

        res.render("admin/role-list",{
            roles:roles
        })
    }
    catch(err){
        console.log(err)
    }
}   


exports.get_role_edit = async function(req, res) {
    const roleid=req.params.roleid;
    try {
    const role=await Role.findByPk(roleid);
    const users=await role.getUsers();
    if(role){
        return res.render("admin/role-edit",{
            role:role,
            users:users
        })
    }
    res.redirect("admin/roles");
    }
    catch(err) {
        console.log(err);
    }
}



exports.post_role_edit = async (req, res)=> {
    const roleid=req.body.roleid;
    const rolename=req.body.rolename;
    try{
        await Role.update({rolename:rolename},{
            where:{
                id:roleid
            }
        });
        return res.redirect("/admin/roles")

    
    }
    catch(err){
        console.log(err)
    }
}   

exports.roles_remove = async (req, res)=> {
    const roleid=req.body.roleid;
    const userid=req.body.userid;
    try{
       await sequelize.query(`delete from userRoles where userId=${userid} and roleId=${roleid}`);
       return res.redirect("/admin/roles/"+roleid)
    }
    catch(err){
        console.log(err)
    }
}   

exports.get_user = async (req, res)=> {
    try{
       
        const users=await User.findAll({
            attributes:['id','fullname','email'],
            include:{
                model:Role,
                attributes:['rolename']
            }
        });

        res.render("admin/user-list",{
            users:users
        })
    }
    catch(err){
        console.log(err)
    }
}   

exports.get_user_edit = async (req, res)=> {
    const userid=req.params.userid;
    try{
        const user=await User.findOne({
            where:{id:userid},
            include:{model:Role,attributes:["id"]}
        });
       
       const roles=await Role.findAll();

        res.render("admin/user-edit",{
            user:user,
            roles:roles
        })
    }
    catch(err){
        console.log(err)
    }
}   

exports.post_user_edit = async (req, res)=> {
    const userid=req.body.userid;
    const fullname=req.body.fullname;
    const email=req.body.email;
    const roleIds=req.body.roles;
    try{
        const user=await User.findOne({
            where:{id:userid},
            include:{model:Role,attributes:["id"]}
        });
        
        if(user){
            user.fullname=fullname;
            user.email=email;

            if(roleIds==undefined){
                await user.removeRoles(user.roles);
            }else{
                await user.removeRoles(user.roles);
                const selectedRoles=await Role.findAll({
                    where:{
                        id:{
                            [Op.in]:roleIds
                        }
                    }
                });
                await user.addRoles(selectedRoles);
            }
            await user.save();
            return res.redirect("/admin/users");
        }
        res.redirect("/admin/users")
    }
    catch(err){
        console.log(err);
    }
}
