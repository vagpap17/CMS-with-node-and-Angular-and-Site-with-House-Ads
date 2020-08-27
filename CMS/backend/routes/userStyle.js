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

  router.post("",function(req,res){
    connection.query("update styles set svalue=?where id=1;",req.body.svalue,function(err,result){
      if(err){
        console.log(err)
      }else{
        res.status(201).json({ok:"ok"})
      }
    })
  })

  router.get("",function(req,res){
    connection.query("select svalue from styles where id=1",function(err,result){
      if(err){
        console.log(err)
      }else{
        res.status(201).json(result[0].svalue)
      }
    })
  })

module.exports=router
