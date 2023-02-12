//express
const express = require("express");
const app = express();

const cookieParser=require("cookie-parser");
const session=require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const csurf=require("csurf");

//node moodules
const path = require("path");



//routes
const userRoutes=require("./routes/user")
const adminRoutes=require("./routes/admin");
const authRoutes=require("./routes/auth");

//custom modules
const sequelize=require("./data/db");
const dummyData=require("./data/dummy-data");
const locals=require("./middlewares/locals");

//template engine
app.set("view engine","ejs");

//models
const Category=require("./models/category");
const Product=require("./models/product");
const User=require("./models/user");
const Role=require("./models/role");

//middleware
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({
    secret:"hello world",
    resave:false,
    saveUninitialized: false,
    cookie:{
        maxAge:1000*60*60*24
    },
    store:new SequelizeStore({
        db:sequelize
    })
}));

app.use(locals);
app.use(csurf());


app.use("/libs",express.static("node_modules"));
app.use("/static",express.static("public"))
 
app.use("/admin", adminRoutes);
app.use("/account", authRoutes);
app.use(userRoutes);


Product.belongsTo(User,{
    foreignKey:{
        allowNull:true
    }
});
User.hasMany(Product);

Product.belongsToMany(Category,{through:"productCategories"});
Category.belongsToMany(Product,{through:"productCategories"});



User.belongsToMany(Role,{through:"userRoles"});
Role.belongsToMany(User,{through:"userRoles"});


(async ()=>{
    // await sequelize.sync({force:true});
    // await dummyData();
})()


app.listen(3000, function() {
    console.log("listening on port 3000");
});