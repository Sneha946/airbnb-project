const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const User=require("../model/User.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userControl=require("../controllers/control-users.js");

router.route("/signup")
    .get(userControl.renderSignUpForm)
    //req.user--->undefined(not logged in)-->signup,login
    //req.user-->object-->logged in
    .post(wrapAsync(userControl.signup))




router.route("/login")
    .get(userControl.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local",
            {failureRedirect:"/login",failureFlash:true}),
        userControl.login
    );

router.get("/logout",userControl.logout);
module.exports=router;