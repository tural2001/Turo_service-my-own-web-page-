const nodemailer = require("nodemailer");
const config=require("../config");

let transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    secureConnection:false,
    port:587,
    tls:{
        ciphers:"SSLv3"
    },
    auth: {
      user: config.email.username,
      pass: config.email.password, 
    },
});

module.exports=transporter;
