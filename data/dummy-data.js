const Category=require("../models/category");
const Product=require("../models/product");
const slugField=require("../helpers/slugfield");
const bcrypt=require("bcrypt");
const User = require("../models/user");
const Role = require("../models/role");
const { use } = require("../helpers/send-mail");


async function populate(){
    const count=await Category.count();

    if(count==0){

        const users=await User.bulkCreate([
            {fullname:"Tural Memmedov",email:"tural@mail.ru",password:await bcrypt.hash("12345a",10)},
            {fullname:"Elvin Haciyev",email:"elvin@mail.ru",password:await bcrypt.hash("12345a",10)},
            {fullname:"Elcin Eliyev",email:"elnur@mail.ru",password:await bcrypt.hash("12345a",10)},
            {fullname:"Elvin Eliyev",email:"elnur@mail.ru",password:await bcrypt.hash("12345a",10)},
            {fullname:"Ayse Eliyeve",email:"elnur@mail.ru",password:await bcrypt.hash("12345a",10)},
        ])

        const roles=await Role.bulkCreate([
            {rolename:"admin"},
            {rolename:"moderator"},
            {rolename:"guest"},
        ]);

        await users[0].addRole(roles[0]);
        await users[1].addRole(roles[1]);
        await users[2].addRole(roles[1]);
        await users[3].addRole(roles[1]);
        await users[4].addRole(roles[2]);


       const categories= await Category.bulkCreate([
            {ad:"Yaglar",url:slugField("Yaglar")},
            {ad:"Tekerler",url:slugField("Tekerler")},
            {ad:"Ehtiyyat hissleri",url:slugField("Ehtiyyat hissleri")}
        ]);

  

       const products= await Product.bulkCreate([
            {
                ad:"liqui Moly",
                url:slugField("liqui Moly"),
                haqqinda:"gozel mehsul",
                sekil:"amsoil.jpeg",
                qiymet:"120",
                anasayfa:true,
                onay:true,
                userId:2
            },
            {
                ad:" Amsoil ",
                url:slugField("amsoil"),
                haqqinda:"gozel mehsul",
                sekil:"liquimoly.jpg",
                qiymet:"120",
                anasayfa:true,
                onay:true,
                userId:2
            },
            {
                ad:"Castrol ",
                url:slugField("castrol"),
                haqqinda:"gozel mehsul",
                sekil:"liquimoly.jpg",
                qiymet:"120",
                anasayfa:true,
                onay:true,
                userId:2

            },
            {
                ad:"liqui Moly",
                url:slugField("liqui Moly"),
                haqqinda:"gozel mehsul",
                sekil:"amsoil.jpeg",
                qiymet:"120",
                anasayfa:true,
                onay:true,
                userId:2

            },
            {
                ad:" Amsoil ",
                url:slugField("amsoil"),
                haqqinda:"gozel mehsul",
                sekil:"liquimoly.jpg",
                qiymet:"120",
                anasayfa:true,
                onay:true,
                userId:2

            },
            {
                ad:"Castrol ",
                url:slugField("castrol"),
                haqqinda:"gozel mehsul",
                sekil:"liquimoly.jpg",
                qiymet:"120",
                anasayfa:true,
                onay:true,
                userId:3

            },
            {
                ad:"liqui Moly",
                url:slugField("liqui Moly"),
                haqqinda:"gozel mehsul",
                sekil:"amsoil.jpeg",
                qiymet:"120",
                anasayfa:true,
                onay:true,
                userId:3
            },
            {
                ad:" Amsoil ",
                url:slugField("amsoil"),
                haqqinda:"gozel mehsul",
                sekil:"liquimoly.jpg",
                qiymet:"120",
                anasayfa:true,
                onay:true,
                userId:3
            },
            {
                ad:"Castrol ",
                url:slugField("castrol"),
                haqqinda:"gozel mehsul",
                sekil:"liquimoly.jpg",
                qiymet:"120",
                anasayfa:true,
                onay:true,
                userId:3
            }
        ]);

        await  categories[0].addProduct(products[0]);
        await  categories[0].addProduct(products[2]);
        await  categories[0].addProduct(products[1]);
        await  categories[0].addProduct(products[3]);
        await  categories[0].addProduct(products[4]);
        await  categories[0].addProduct(products[5]);
        await  categories[0].addProduct(products[6]);
        await  categories[0].addProduct(products[7]);
        await  categories[0].addProduct(products[8]);
        await  categories[0].addProduct(products[0]);
        await  categories[0].addProduct(products[1]);
        await  categories[1].addProduct(products[1]);
        await  categories[1].addProduct(products[2]);
        await  categories[2].addProduct(products[2]);

    }

}

module.exports=populate;