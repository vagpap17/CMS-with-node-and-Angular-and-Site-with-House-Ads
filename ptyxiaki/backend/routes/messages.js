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
router.get("",function(req,res){
  q="select * from feedback where agentRating is not null"
  connection.query(q,function(err,results){
    if(err){
      console.log(err)
    }else{
      res.json(results)
    }
  })
})

router.post("",function(req,res){

  q="update contacts set seen=true where id=?;";
  q1="insert into feedback set ?;select last_insert_id() as lastid;select cusName,cusEmail from contacts where id=?"


  for(let i=0;i<req.body.length;i++){
    var formId           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var j = 0; j < 9; j++ ) {
       formId += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    console.log(formId)
    let contact={contact_id:req.body[i],formId:formId}
    console.log(contact)
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
        feedbackCustomer=result1[0].cusName
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
                  html: '<h1>Hello '+feedbackCustomer+'!</h1> <br><p>Thank you for using Vagpap to find your next Property.<br>In order to improve our services we need your feedback!</p><a href="'+ link +'">Review our services</a><br>' // html body
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
    q="select * from contacts order by id desc"
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
  let score=0;
  let rating=0;
  for(key in req.body){
    console.log(key)
    if(key=="wSeen"||key=="useAgain"||key=="submit"){
    }else if (key==="agentRating"){
      rating=rating+parseInt(req.body[key])
    }else{
      console.log("value",parseInt(req.body[key]))
      score=score+parseInt(req.body[key])
    }

  }
  console.log("score",score)
  req.body.score=score
  console.log("agrating",rating)
  q="update feedback set ? where formId=?;"
  q1="update users set rating = rating + ? where id=(select conAgent from contacts inner join feedback on contacts.id=feedback.contact_id where formId=?)"
  q2="update users set ratingCount=ratingCount+1 where id=(select conAgent from contacts inner join feedback on contacts.id=feedback.contact_id where formId=?)"
  connection.query(q,[req.body,req.params.id],function(err,results){
    if(err){
      console.log(err)
    }else{
      connection.query(q1,[rating,req.params.id],function(err,results){
        if(err){
          console.log(err)
        }else{
          connection.query(q2,req.params.id,function(err,results){
            if(err){

            }else{
              res.status(201).json({
                done:true
              })
            }
          })
        }
      })
    }
  })

})




module.exports=router;

