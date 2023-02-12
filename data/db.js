const mysql=require("mysql2");
const config=require("../config");

const Sequelize=require("sequelize");

const sequelize=new Sequelize(config.db.database,config.db.user,config.db.password,{
    dialect:"mysql",
    host:config.db.host,
    define:{
        timestamps:false
    },
    storage:"./session.mysql"
});


async function connect(){
    try{
        await sequelize.authenticate();
        console.log("mysql baglandi")
    }
    catch(err){
        console.log(err);
    }  
}

connect();

module.exports=sequelize;

// let connection=mysql.createConnection(config.db);

// connection.connect(function(err){
//     if(err){
//         console.log(err);
//     }
//     console.log("mysql isleyir");
// })

// module.exports=connection.promise(); 