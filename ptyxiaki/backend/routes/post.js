const express= require("express");
const multer=require("multer");
const mysql=require("mysql");
const router=express.Router();
const middleware=require("../middleware")
const nodemailer = require("nodemailer");
fs=require("fs")

var connection=mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"19967890",
  insecureAuth:true,
  database:"ptyxiaki",
  multipleStatements:true
})

const storage = multer.diskStorage({

  destination: (req, file, callBack) => {
      callBack(null, 'backend/images')
  },

  filename: (req, file, callBack) => {

      callBack(null, Date.now() +file.originalname )
  }
})
const upload = multer({ storage: storage })
router.get("",function(req,res,next){
  q="select * from posts right join images on posts.id=images.post_id group by posts.id order by dateAdded desc"
  // q="select * from posts"
  connection.query(q,function(err,results,fields){
      if(err){
        console.log(err);
    }else{
        res.send(results)
    }
  })
})
router.get("/stars",function(req,res,next){
  q="select * from posts inner join images on posts.id=images.post_id  where posts.starAd='1' group by posts.id"
  connection.query(q,function(err,results,fields){
    if(err){
      console.log(err)
    }else{
      res.json(results)
    }
  })
})

router.get("/show/:adtype",function(req,res,next){
  if(req.params.adtype==="resSales"){
    q="select * from posts inner join images on posts.id=images.post_id  where btype='apartment' AND adtype='sell' group by posts.id"
    connection.query(q,function(err,results,fields){
        if(err){
          console.log(err);
      }else{
          res.json(results)
      }
    })
  }
  if(req.params.adtype==="resRent"){
    q="select * from posts inner join images on posts.id=images.post_id  where btype='apartment' AND adtype='rent' group by posts.id"
    connection.query(q,function(err,results,fields){
        if(err){
          console.log(err);
      }else{
          res.json(results)
      }
    })
  }
  if(req.params.adtype==="comSales"){
    q="select * from posts inner join images on posts.id=images.post_id  where btype='shop' AND adtype='sell' group by posts.id"
    connection.query(q,function(err,results,fields){
        if(err){
          console.log(err);
      }else{
          res.json(results)
      }
    })
  }
  if(req.params.adtype==="comRent"){
    q="select * from posts inner join images on posts.id=images.post_id  where btype='shop' AND adtype='rent' group by posts.id"
    connection.query(q,function(err,results,fields){
        if(err){
          console.log(err);
      }else{
          res.json(results)
      }
    })
  }

})


router.get("/:id",function(req,res,next){
  q="select * from posts where id=?;select photoname from posts inner join images on posts.id=images.post_id where posts.id=?"
  connection.query(q,[req.params.id,req.params.id],function(err,results,fields){
    var post=JSON.parse(JSON.stringify(results[0]))
    var images=JSON.parse(JSON.stringify(results[1]))
      if(err){
        console.log(err);
    }else{
        res.status(200).json(results)
    }
  })
})

router.post("",middleware.checkAuth,upload.array('files',10),function(req,res,next){
  // const obj = JSON.parse(JSON.stringify(req.body));
  console.log(req.files)
  console.log(req.body)

  q="insert into posts set?;select last_insert_id() as lastid"
  connection.query(q,req.body,function(err,results,fields){
    if(err){
      console.log(err);

    }else{
      var result=JSON.parse(JSON.stringify(results[1]))
      filesnum=req.files.length

      for (var i=0;i<filesnum;i++){
        const url=req.protocol+ "://"+req.get("host")
        imagePath=url+"/images/"+req.files[i].filename
        var newFile={photoname:imagePath,post_id:result[0].lastid}
        q1="insert into images set?";
        connection.query(q1,newFile,function(err,results){
          if(err){
            console.log(err)
          }else{
            console.log("upload done")
          }
        })
      }
      res.status(201).json({

      })
    }
  })
})

router.put("/:id",middleware.checkAuth,function(req,res,next){
  // const obj = JSON.parse(JSON.stringify(req.body));
  q="update posts set ? where id=?;"
  connection.query(q,[req.body,req.params.id],function(err,results,fields){
    if(err){
      console.log(err);

    }else{
      console.log(results)
      res.status(201).json({

      })
    }
  })
})
router.post("/images/:id",middleware.checkAuth,upload.array('files',5),function(req,res,next){
  // console.log("forupload",req.files)//upload images
  // console.log("fordelete",req.body.files)//delete
  var array=[req.body.files]
  console.log(array)
    if(req.files.length>0){//new files
      filesnum=req.files.length

      for (var i=0;i<filesnum;i++){
        const url=req.protocol+ "://"+req.get("host")
        imagePath=url+"/images/"+req.files[i].filename
        var newFile={photoname:imagePath,post_id:req.params.id}
        q1="insert into images set?";
        connection.query(q1,newFile,function(err,results){
          if(err){
            console.log(err)
            return
          }else{
            console.log("upload done")
            return
          }
        })
      }

    }
    if(array[0] !== undefined){
      if(array[0].length>30){
        console.log("ena file")
        var fields=req.body.files.split("http://localhost:3000/")
         var file=fields[1]
        //  var filePath="/assets/images/"+file
         fs.unlink("backend/"+file,function(err){
          if(err) throw err;

          console.log('File deleted!');
      });
         console.log(file)
         q="delete from images where photoname=?"
        connection.query(q,req.body.files,function(err,results,fields){
          if(err){
            console.log(err)
          }
          console.log('rows affected:',results.affectedRows)

        })
      } if(array[0].length>=2 && array[0].length<30){
        console.log("polla file")
        for(let i=0;i<req.body.files.length;i++){
          var fields=req.body.files[i].split("http://localhost:3000/")
          var file=fields[1]
          fs.unlink("backend/"+file,function(err){
            if(err) throw err;

            console.log('File deleted!');
        });
          q="delete from images where photoname=?"
          connection.query(q,req.body.files[i],function(err,results,fields){
            if(err){
              console.log(err)
            }
            console.log('rows affected:',results.affectedRows)
          })

        }

      }

    }

        res.status(201).json({

        })

})

router.delete("/:id",middleware.checkAuth,function(req,res){
  deletePostId=req.params.id
  q="select photoname from images where post_id=?;"
  connection.query(q,deletePostId,function(error,results){
    console.log(results[0].photoname)
      for(let i=0;i<results.length;i++){
      var fields=results[i].photoname.split("http://localhost:3000/")
      var file=fields[1]
      fs.unlink("backend/"+file,function(err){
        if(err) throw err;

        console.log('File deleted!');
      });
    }
  })
  q1="delete from images where post_id=?;delete from posts where id=?;"
  connection.query(q1,[deletePostId,deletePostId],function(error,results){
    if(error){
      console.log(error)
      res.send("error")
    }

    res.status(201).json({

    })
  })
})




module.exports= router;
