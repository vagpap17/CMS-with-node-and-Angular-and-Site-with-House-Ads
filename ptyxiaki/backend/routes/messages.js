const express= require("express");
const mysql=require("mysql");
const router=express.Router();
const middleware=require("../middleware")
const nodemailer = require("nodemailer");

var connection=mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"19967890",
  insecureAuth:true,
  database:"ptyxiaki",
  multipleStatements:true
})

router.post("",function(req,res){
  q2="select * from feedback where formId=?;"
  duplicate=true;
    var formId           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 9; i++ ) {
       formId += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    console.log(formId)




  q="update contacts set seen=true where id=?;";
  q1="insert into feedback set ?;select last_insert_id() as lastid;select cusName,cusEmail from contacts where id=?"


  for(let i=0;i<req.body.length;i++){
    let contact={contact_id:req.body[i],formId:formId}
    connection.query(q,req.body[i],function(err,results){
      if(err){
        console.log(err)
      }else{
        // console.log(results)
      }
    })
    connection.query(q1,[contact,req.body[i]],function(err,results){
      if(err){
        console.log(err)
      }else{
        var result1=JSON.parse(JSON.stringify(results[2]))
        feedbackEmail=result1[0].cusEmail
        var link="http://localhost:4300/feedback/"+formId
          async function main() {
               const transporter = nodemailer.createTransport({
                  host: 'smtp.gmail.com',
                  port: 465,
                  secure: true,
                  auth: {
                      user: 'pappasvag@gmail.com',
                      pass: '199678901731996VaGoS'
                  }
              });

                // send mail with defined transport object
                let info = await transporter.sendMail({
                  from: 'test', // sender address
                  to: feedbackEmail, // list of receivers
                  subject: "Hello ✔", // Subject line
                  text: "Hello world?", // plain text body
                  html: 'Hello please give us feedback<a href="'+ link +'">Give us feedback</a>' // html body
                });

                console.log("Message sent: %s", info.messageId);

              }

          main().catch(console.error);
      }
    })
  }
  res.json("ok")

})
router.get("/:id/:pre",function(req,res){
  id=req.params.id
  pre=req.params.pre
  if(pre==="1"){
    q="select * from contacts"
    connection.query(q,function(err,results){
      if(err){
        console.log(err)
      }else{
        res.json(results)
      }
    })
  }else{
    q="select * from contacts where conAgent=?"
    connection.query(q,req.params.id,function(error,results){
      if(error){
        console.log(error)
      }else{
        res.json(results)
      }
    })
  }

})

router.get("/feeds",function(req,res){
  q="select formId,submit from feedback"
  connection.query(q,function(err,results){
    if(err){
      console.log(err)
    }else{
      res.json(results)
    }
  })

})
router.put("/:id",function(req,res){
  console.log(req.body)
  q="update feedback set ? where formId=?;"
  connection.query(q,[req.body,req.params.id],function(err,results){
    if(err){
      console.log(err)
    }else{
      res.status(201).json({
        done:true
      })
    }
  })
})




module.exports=router;
