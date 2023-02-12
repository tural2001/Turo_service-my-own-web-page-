const{ DataTypes }=require("sequelize");
const sequelize=require("../data/db");

const Product=sequelize.define("product",{
    ad:{
        type:DataTypes.STRING,
        allowNull:false
    },
    url:{
        type:DataTypes.STRING,
        allowNull:false
    },
    haqqinda:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    sekil:{
        type:DataTypes.STRING,
        allowNull:false
    },
    qiymet:{
        type:DataTypes.STRING,
        allowNull:false
    },
    anasayfa:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    onay:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
},{
    timestamps:true
});


module.exports=Product;