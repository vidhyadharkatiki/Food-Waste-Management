const express=require("express");
const connection=require("./database.js");
const path=require("path");
const bodyParser = require("body-parser");
const cors=require("cors");
const nodemailer = require('nodemailer');
const mysql = require('mysql2/promise');
const app=express();

app.use(express.static(__dirname)); 

app.use(cors());

app.use(bodyParser.urlencoded({ extended:true }));


app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"dashboard.html"));
});


app.listen(2000,"0.0.0.0",(err)=>{
    if(err){
        console.log("not connected to server");
    }else{
        console.log("server is running");
    }
});


app.post('/signup_html',(req,res)=>{
    const {e,p1}=req.body;
    console.log(e+p1);

    const sql = "insert into signup (email,password) values(?,?)";
    connection.query(sql,[e,p1],(err,result)=>{
        if(err){
            console.log("error is :"+err);
            return res.status(500).json({success : false,msg:"database error !"});
        }
        res.json({success:true})
    });
});


const gotp =  Math.floor(100000 + Math.random() * 900000);
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:'',
        pass:'',
    },
});

app.post('/send_otp.html',async(req,res)=>{
    let e = req.body;
    let email1 = e;
    const mail = {
        from :'',
        to :email1.e,
        subject : 'your otp',
        text : `${gotp}`,
    };
        const sql = "insert into otp values (?,?)";
        connection.query(sql,[email1.e,gotp],(err,result)=>{
        if(err){
            return res.status(500).json({success : false,msg:"database error !"});
        }
        });
    try{
        await transporter.sendMail(mail);
        console.log(gotp);
        console.log("otp sent");
        return res.json({success:true});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({success:false});

    }
});

app.post('/verify_html',async(req,res)=>{
    const {e,otp1} = req.body;
    let email1 = e;
    const sql = "select * from otp where email = ? and otp = ?";
    connection.query(sql,[email1,otp1],(err,result)=>{
        if(err){
            return res.status(500).json({success:false});
        }
        if(result.length===0){
            return res.status(500).json({success:false,msg:"invalid otp"});
        }
            connection.query("delete from otp where email = ? and otp = ?",[email1,otp1],(err,result)=>{
                if(err){
                    return res.status(500).json({success:false,msg:"error in deletion"});
                }else{
                    res.json({success:true});
                }
            });
    })
});

app.post('user_html',async(req,res)=>{
    const {e} = req.body;
    connection.query(sql,"select * from signup where email = ?",[e],(err,result)=>{
        if(result.length>0){
            console.log("hello user");
            return res.json({success:true});
        }
        if(result.length === 0){
            return res.json({success:false});
        }
        if(err){
            return res.status(500).json({success:false,msg:"error in signup"});
        }
    })
});

app.post('/ver_html',async(req,res)=>{
    const {e} = req.body;
    console.log("req");
    connection.query("select email from signup where email = ?",[e],(err,result)=>{
        console.log(e);
        if(err){
            console("error in err")
            res.status(500).json({success:false})
        }
        if(result.length>0){
            console.log("error in  1")
            res.json({success:true});
        }
        else if(result.length===0){
            console.log("error in 0")
            res.json({success:false});
        }
    });
});

app.post('/loginform.html',(req,res)=>{
    const {e,pass} = req.body;
    // console.log(e);
    // console.log(pass);
    connection.query("select * from signup where email = ? and password = ?",[e,pass],(err,result)=>{
        if(result.length===0){
            // console.log("login hi")
            return res.status(500).json({success:false,msg:"incorrect password or username"});
        }
        if(result.length>0){
            return res.json({success:true});
        }if(err){
            return res.status(500).json({success:false,msg:"error in database"});
        }
    });
});

app.post('/location_html',(req,res)=>{
    const {latitude,longitude,contact1,order1} = req.body;
    connection.query("insert into location values (?,?,?,?)",[latitude,longitude,contact1,order1],(err,result)=>{
        if(err){
            return res.status(500).json({success:false,msg:"database problem"});
        }
        return res.json({success:true});
    });
});


app.get('/transfer-data',(req,res)=>{
    connection.query("select * from location",(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log(result);
            res.json({success:true,data:result});
        }
    })
});



app.post('/transfer-data-store',async(req,res)=>{
    const {lat,lon,con,ord} = req.body;
    connection.query("insert into storelocation values(?,?,?,?)",[lat,lon,con,ord],(err,result)=>{
        if(err){
            console.log(err);
            res.status(500).json({success:false,msg:err});
        }
        connection.query("delete from location where latitude = ?",[lat],(error,r)=>{
            res.json({success:true});
        })
    })
});

app.get('/donate_html',(req,res)=>{
    connection.query("select * from storelocation",(err,result)=>{
        if(err){
            console.log(err);
            res.status(500).json({success:false,msg:err});
        }
        res.json({success:true,data:result});
    })
});


app.post('/send_mail',async(req,res)=>{
    const {val1,val2,val3,val4,email} = req.body;
    // console.log(email);
    // console.log(email);
    const mail = {
        from :'',
        to :email,
        subject : 'donor details',
        text : `
        latitude - ${val1},
        longitude - ${val2},
        order - ${val3},
        contact - ${val4}
        `,
    };

    try{
        await transporter.sendMail(mail);
        console.log("mail sent");
        res.json({success:true});
    }catch(err){{
        res.status(500).json({success:false,msg:"err"});
    }}
});

app.get('/extract_html',async(req,res)=>{
    // const {value} = req.body;
    // console.log(value);
    connection.query("select * from storelocation",(err,result)=>{
        if(err){
            return res.status(500).json({success:false,msg:"Error"});
        }
        console.log(result);
        return res.json({success:true,data:result});
    });
})

app.post('/delete_data',async(req,res)=>{
    const {val1,val2,val3,val4} = req.body;
    connection.query("delete from storelocation where latitude = ? and longitude = ? and order1 = ? and contact1 = ?",[val1,val2,val3,val4],(err,result)=>{
        if(err){
            return res.status(500).json({success:false,msg:"Error"});
        }
        return res.json({success:true});
    })
});