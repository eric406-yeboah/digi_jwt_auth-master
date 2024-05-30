const {Router} = require("express")
const { signup_get, login_get, 
      signup_post, login_post,
      logout_get} = require("../controller/authController")

const router = Router()

//After login - manully we still can go to login/signup pages so:
function isUser(req,res,next) {
      if(res.locals.user){
            //from locals
            return res.redirect("/")
      }
      next();
}

router.route("/signup")
      .get(isUser,signup_get)
      .post(signup_post)

router.route("/login")
      .get(isUser, login_get)
      .post(login_post)


router.route('/logout').get(logout_get)

module.exports = router