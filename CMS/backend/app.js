const path=require("path")
const express=require('express');
const bodyParser=require('body-parser')
const app=express();
// const formidable = require('express-formidable');
// const mongoose= require("mongoose");
var multer=require("multer")
var upload = multer();
const messagesRoutes=require("./routes/messages")
const postsRoutes=require("./routes/post")
const userRoutes=require("./routes/user")
const styleRoutes=require("./routes/userStyle")
const mysql=require("mysql")
app.use("/images",express.static(path.join("backend/images")));



// app.use((req,res,next)=>{
//   res.setHeader('Access-Control-Allow-Origin',"*");
//   res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-type,Accept");
//   res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS");
//   res.setHeader("Content-type","application/json")
//   next();
// });

// app.use(function(req, res, next) {
//   if (req.headers['content-type'] === 'application/json;') {
//     req.headers['content-type'] = 'application/json';
//   }
//   next();
// });
// app.use(upload.array());
app.use("/images",express.static(path.join("backend/images")));
app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({limit: '50mb',extended:true, parameterLimit: 50000 }));

var connection=mysql.createConnection({
 your database"
})



app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin',"*");
  res.header("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization");
  res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,PATCH,OPTIONS");

  next();
});


app.use("/api/messages",messagesRoutes);
app.use("/api/posts",postsRoutes);
app.use("/api/user",userRoutes)
app.use("/api/styles",styleRoutes)



module.exports = app;
