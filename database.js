const mysql = require('mysql2');

var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'vidhyadhar123A@',
    database:'food_wastage_management'
});

connection.connect((err)=>{
    if(!!err){
        console.log("error in database : "+err);
    }

    else{
        console.log("connected");
    }
})

module.exports = connection;