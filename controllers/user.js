const Product=require("../models/product");
const Category=require("../models/category");


const { Op }=require("sequelize");

exports.products_detail = async (req, res)=> {
    const slug=req.params.slug;
    try{
        const product =await  Product.findOne({
            where:{
                url:slug
            },
            raw:true
        });

        if(product){
            res.render("users/product-details",{
                product: product
            });
        }
        res.redirect("/");
    }
    catch(err){
        console.log(err);
    }
}

exports.products = async (req, res)=> {
    const size=6;
    const { page=0 }=req.query;
    const slug =req.params.slug;
    try{
        const {rows, count}= await  Product.findAndCountAll({
            where:{anasayfa:1},
            raw:true,
            include:slug? {model:Category ,where:{url:slug}}:null,
            limit:size,
            offset:page * size
        });

        {rows,count}
        const categories=await  Category.findAll({raw:true});
        res.render("users/products",{
            products: rows,
            totalItems:count,
            totalPages: Math.ceil(count/size),
            currentPage: page,
            categories: categories,
            selectedCategory:slug
        })
    }
    catch(err){
        console.log(err);
    }
}

exports.index = (req, res)=> { 
    res.render("users/index",{
    });
}