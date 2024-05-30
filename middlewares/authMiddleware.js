const jwt = require("jsonwebtoken")
const User = require("../models/User")

const requireAuth = (req,res, next) => { 
  const token = req.cookies.jwt;
  
  if(!token){
    // Token is missing; user is not authenticated  401 = not authorized
    return res.status(401).redirect('/login'); // Redirect to login page
  }

  jwt.verify(token, process.env.SECRET_TOKEN, (err, decodedToken) => {
    if(err){
      // Token verification failed (e.g., expired or tampered with)
      return res.status(401).redirect('/login'); // Redirect to login page
    }

    console.log(decodedToken)
    next();
  })
}

const checkUser = (req,res,next) => { 
  const token = req.cookies.jwt;

  if(token){
    jwt.verify(token, process.env.SECRET_TOKEN, async (err, decodedToken) =>{
      if(err){
        console.log(`err message --->  ${err.message}`)
        res.locals.user = null;
        next();
      }
      else{
        console.log(decodedToken) //{ id: 'x', iat: , exp:  }
        let user = await User.findById(decodedToken.id)
        /* we want to inject the user on our views by using locals 
          res.locals.what ever I want to call it in order to make it accesible from the views*/
        res.locals.user = user;
        next();
      }
    })
  }
  else{
    res.locals.user = null;
    next();
  }
 }

module.exports = {
   checkUser, requireAuth
}