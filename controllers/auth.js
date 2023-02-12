const User = require("../models/user");
const bcrypt=require("bcrypt");
const { name } = require("ejs");
const transporter=require("../helpers/send-mail");
const auth = require("../middlewares/auth");
const config=require("../config");
const crypto=require("crypto");
const { Op } = require("sequelize");

exports.get_register=async (req,res)=>{
    try{
        return res.render("auth/register",{
        })
    }
    catch(error){
      console.log(error);
    }
}

exports.post_register=async (req,res)=>{
    const fullname=req.body.fullname;
    const email=req.body.email;
    const password=req.body.password;



    try{
        await User.create({fullname:fullname,password:password,email:email});

        let info= await transporter.sendMail({
            from: config.email, 
            to: "nrpkzapehljmilitqw@tmmwj.net", 
            subject: "Hello ✔", 
            text: "Hello world?",
            html: "<b>Hello world?</b>", 
          });

        req.session.message={text:"Hesabiniza giris ede bilersiniz",class:"success"};
        return res.redirect("login");
    }
    catch(err){
        let msg="";
        for(let error of err.errors){
            msg +=error.message +" "
        }    
        return res.render("auth/register",{
            message:msg
        });

    }
}

exports.get_login=async (req,res)=>{
    const message=req.session.message;
    delete req.session.message;
    try{
        return res.render("auth/login",{
            message:message,
            csrfToken:req.csrfToken()
        })
    }
    catch(err){
        console.log(err)
    }
}

exports.get_logout=async (req,res)=>{
    
    try{
        await req.session.destroy();
        return res.redirect("/account/login")
    }
    catch(err){
        console.log(err)
    }
}

exports.post_login=async (req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    try{
    const user=await User.findOne({
            where:{
                email:email,
            }
        })

        if(!user){
            return res.render("auth/login",{
                message:{text:"Emailiniz sehvdir",class:"danger"}
            })
        }

        const match=await bcrypt.compare(password,user.password);

        if(match){
            const userRoles=await user.getRoles({
                attributes:["rolename"],
                raw:true
            });
            req.session.roles=userRoles.map((role)=>role["rolename"]);
            req.session.isAuth = true;
            req.session.fullname = user.fullname;
            req.session.userid=user.id
            const url=req.query.returnUrl|| "/";

            return  res.redirect(url);
        }else{
            return res.render("auth/login",{
                message:{text:"Parolunuz sehvdir",class:"danger"}
            })
        }

    }
    catch(err){
        console.log(err)
    }
}

exports.get_reset_password=async (req,res)=>{
    const message=req.session.message;
    delete req.session.message;
    try{
        return res.render("auth/reset-password",{
            message:message
        })
    }
    catch(err){
        console.log(err)
    }
}

exports.post_reset_password=async (req,res)=>{
    const email=req.body.email;
    try{
        var token=crypto.randomBytes(32).toString("hex");
        const user=await User.findOne({where:{email:email}});

        if(!user){
            req.session.message={text:"Emailiniz bulunamadi",class:"warning"};
            return res.redirect("reset-password");
        } 

        user.resetToken=token;
        user.resetTokenExpiration= Date.now() + (1000*60*60);  
        await user.save();    


        transporter.sendMail({
            from: config.email.from, 
            to: email, 
            subject: "Reset password ✔", 
            html: `<p>Parolunuzu sifirlanmaq ucun sagidaki linke tiklayin </p>
                <p>
                <a href="http://127.0.0.1:3000/account/new-password/${token}">Parolu sifirlayin</a>
                </p>
            `, 
          });

          req.session.message={text:"parolu sifirlamaq icin epostani kontrol edin",class:"success"};
          res.redirect("login");

    }
    catch(err){
        console.log(err)
    }
}

exports.get_new_password=async (req,res)=>{
    const token=req.params.token;
    try{
        const user=await User.findOne({
            where:{
                resetToken:token,
                resetTokenExpiration:{
                    [Op.gt]: Date.now()
                }
            }
        })
        return res.render("auth/new-password",{
            token:token,
            userId:user.id
        })
    }
    catch(err){
        console.log(err)
    }
}

exports.post_new_password=async (req,res)=>{
    const token=req.body.token;
    const userId=req.body.userId;
    const newPassword=req.body.password;

    try{
        const user=await User.findOne({
            where:{
                resetToken:token,
                resetTokenExpiration:{
                    [Op.gt]: Date.now()
                },
                id:userId
            }
        });

        user.password=await bcrypt.hash(newPassword,10);
        user.resetToken=null;
        user.resetTokenExpiration=null;
        await user.save();
       
        req.session.message={text:"parolaniz guncellendi",class:"success"};
        return res.redirect("login");
    }
    catch(err){
        console.log(err)
    }
}