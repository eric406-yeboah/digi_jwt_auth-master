//calling our model
const User = require("../models/User")
const jwt = require("jsonwebtoken")

const handleErrors = (err) => { 
  //console.log(err.message)
  let objError = {username: '', email: '', password: ''}

  // for LOGIN ONLY - User.js model - statics login method
  if (err.message === 'incorrect email') objError.email = 'That email is not registered';
  if (err.message === 'incorrect password') objError.password = 'That password is incorrect';


  // duplicate error code
  if(err.code === 11000){
    if(err.message.includes("username")){
      objError.username = 'that username already exists';
    }
    if(err.message.includes("email")){
      objError.email = 'that email is already registered';
    }
    return objError
  }

  // validation errors
  if(err.message.includes('user validation failed')){
    Object.values(err.errors).forEach(({properties}) => {
      objError[properties.path] = properties.message
    }) 
  }

  return objError
}

//we create the JWT
const maxAge = 3 * 24 * 60 * 60 // times in seconds = 3 days
const createToken = (id) => {
  return jwt.sign({id}, process.env.SECRET_TOKEN, {
    expiresIn: maxAge
  })
}

const signup_get = (req,res) => { res.render('signup', {myTitle: 'AuthPage'}) }

const signup_post = async (req,res) => { 
  try {
    const user = await User.create(req.body)
    //store the JWT in a cookie
    const token = createToken(user._id)
    // httpOnly means we cannot alterate the value of the cookie in the frontEnd - cannot be accessed by the frontend
    res.cookie("jwt", token, {
      httpOnly:true,
       maxAge: maxAge * 1000 // by default maxAge is milliseconds
    })
    /* as long as they have the token in the cookie - user is considered 
        LOGGED IN - authenticated */
    return res.status(201).json({user: user._id})
  } catch (err) {
    let objError = handleErrors(err)
    return res.status(400).json({objError})
  }
}

const login_get = (req,res) => { res.render('login', {myTitle: 'AuthPage'}) }

const login_post = async (req,res) => { 
  const {email, password} = req.body;
  try {
    const user = await User.login(email,password)
    const token = createToken(user._id)
    res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
    return res.status(200).json({user: user._id})
  } catch (err) {
    const objError = handleErrors(err) 
    return res.status(400).json({objError})
  }
 }

 const logout_get = async (req,res) => { 
  res.cookie('jwt','',{maxAge: 1}) // 1 milli second
  res.redirect('/')
}

module.exports = {
  signup_get,
  login_get,
  signup_post,
  login_post,
  logout_get
}