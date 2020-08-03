const jwt = require("jsonwebtoken");
var middlewareObj={}
middlewareObj.checkAuth=function(req,res,next){
  try {

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "secret_this_should_be_longer");
    req.userData = { username: decodedToken.username, userId: decodedToken.userId };
    next()
  } catch (error) {
    res.status(401).json({message:"not auth",error:error});
  }
};
module.exports=middlewareObj;
