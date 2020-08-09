const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql=require("mysql")


var connection=mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"19967890",
  insecureAuth:true,
  database:"ptyxiaki",
  multipleStatements:true
})

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = {
      username: req.body.username,
      upassword: hash,
      uprivileges:req.body.uprivileges
    };
    q="insert into users set?;select last_insert_id() as lastid"
    connection.query(q,user,function(error,newUser){
      if(error){
        console.log(error)
        res.send({
          error:"user already exists"
        })
        res.end()
      }else{
        var result=JSON.parse(JSON.stringify(newUser[1]))
        newpass={id:result[0].lastid,upassword:req.body.password}
        connection.query("insert into unpass set?",newpass,function(err,results){
          if(err){
            console.log(err)
          }else{
            console.log("success")
          }
        })
        res.status(200).json({
          message:'User created!',
          result:newUser
        })
        return;

      }
    })

  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;

  username=req.body.username;
  password=req.body.password;
  if(username&&password){
    connection.query("select * from users where username=?",username,function(error,user){
      if(user===null||error){
        res.status(500).json({error:"wrong username"})
        console.log("error")
      }

      if(user.length>0){
        upassword=bcrypt.compare(req.body.password, user[0].upassword).then(function(result){
          if(result){
            fetchedUser = user;
            const token = jwt.sign(
              { username: fetchedUser[0].username, userId: fetchedUser[0].id },
              "secret_this_should_be_longer",
              { expiresIn: "1h" }
            );

            res.status(200).json({
              user:fetchedUser[0].username,
              token:token,
              expiresIn: 3600,
              userId:fetchedUser[0].id,
              privileges:fetchedUser[0].uprivileges,
              rating:fetchedUser[0].rating,
              ratingCount:fetchedUser[0].ratingCount

            })
          }else{
            res.send({error:"wrong password"})
            res.end();

          }


        })

      }else{
        res.send({error:"user not found"})
        res.end();
      }
    })
  }else{
    res.send({error:"enter username and password"})
  }
});

router.get("",(req,res,next)=>{
  connection.query("select * from users",function(error,results){
    if(error){
      console.log(error)
    }else{
      res.json(results)
    }
  })
})
router.get("/:id",(req,res,next)=>{
  userId=req.params.id
  connection.query("select username,uprivileges from users where id=?",userId,function(error,result){
    if(error){
      console.log(error)
    }else{
      res.json(result)
    }
  })
})
router.put("/:id",(req,res,next)=>{
  userId=req.params.id
  upUser={username:req.body.username,uprivileges:req.body.uprivileges}
  q="update users set? where id=?"
  connection.query(q,[upUser,userId],(error,user)=>{
    if(error){
      console.log(error)
      res.send({error:"username already exists"})
      res.end();
    }else{
      res.status(200).json({status:"success"});
      res.end();
    }

  })


})
router.delete("/:id",(req,res,next)=>{
  userId=req.params.id
  q="delete from unpass where id=?;delete from users where id=?"
  connection.query(q,[userId,userId],function(err,result){
    if(err){
      console.log(err)
    }else{
      res.status(201).json({})
    }
  })
})
router.post("/contact",(req,res,next)=>{
  console.log(req.body)
  q="insert into contacts set?"
  connection.query(q,req.body,function(err,result){
    if(err){
      console.log(err)
    }else{
      res.json("success")
    }
  })
})


module.exports = router;
