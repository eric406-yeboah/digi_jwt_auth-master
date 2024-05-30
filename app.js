const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/authRoutes");
const {checkUser, requireAuth} = require('./middlewares/authMiddleware')

dotenv.config({path: './config/.env'})
const app = express()

const connectToDB = async () => {
  try {
    const PORT = process.env.PORT || 5000;
    const conn = await mongoose.connect(process.env.MONGO_URI)
    app.listen(PORT, () => console.log(`server running on http://localhost:${PORT} && mongoDB ${conn.connection.host}`))
  } catch (err) {
    console.log(`Catch Error: ${err.message}`) 
    // when an error occurs during the attempt to connect to the database.
    process.exit(1) // to exit the current Node.js process - 1: terminating with an error
  }
}
connectToDB()

//set engine
app.set('view engine', 'ejs')

// middlewares
app.use(express.static("public"))
app.use(express.json()) // req.body)
app.use(cookieParser())

app.get("/",checkUser, (req,res) => res.render("home",{myTitle: 'home'}))
app.get("/cards",checkUser, requireAuth, (req,res) => res.render("cards",{myTitle: 'Cards'}))
app.use(checkUser, authRoutes)
app.get('*', (req, res) => {
  res.redirect('/');
});