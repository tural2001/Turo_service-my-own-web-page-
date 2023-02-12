const { DataTypes } = require("sequelize");
const sequelize=require("../data/db");
const bcrypt=require("bcrypt");


const User=sequelize.define("user",{
    fullname:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:{
            args:true,
            msg:"email daha once alinmis"
        }
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    resetToken:{
        type:DataTypes.STRING,
        allowNull:true
    },
    resetTokenExpiration:{
        type:DataTypes.DATE,
        allowNull:true
    }
},{
    timestamps:true
});

User.afterValidate(async(user)=>{
    user.password=await bcrypt.hash(user.password,10);
})

module.exports=User;