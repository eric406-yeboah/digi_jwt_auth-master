const mongoose = require("mongoose")
const {isEmail} = require("validator")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
  username:{
    type: String,
    required: [true, "Please enter a username"],
    unique: true,
    minlength: [4, 'Minimum length is 4 characters'], 
  },
  email:{
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  }
})

//MONGOOSE HOOKS BEFORE THE DOC IS UPLOADED TO THE DB 
userSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt)
})


// In Mongoose, statics is a special property that allows you to define static methods for your models
userSchema.statics.login = async function (email,password) {
   //this = User model
   const user = await this.findOne({email})
   if(user){
     const auth = await bcrypt.compare(password, user.password) 
     if(auth) return user
     throw new Error('incorrect password') //for the authController login_post
   }
 throw new Error('incorrect email')

}

const User = mongoose.model('user', userSchema)

module.exports = User;