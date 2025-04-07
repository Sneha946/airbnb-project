const User=require("../model/User");

module.exports.renderSignUpForm=(req,res)=>{
    res.render("Users/signup.ejs");
}
module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registerdUser=await User.register(newUser,password);
        //automatically login the user when the user is signed in 
        
        req.login(registerdUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","user registered successfully..");
            return res.redirect("/listings");
        });
        
    }
    catch(err){
        req.flash("error",err.message);
        return res.redirect("/signup");
    }
   
    
}
module.exports.renderLoginForm=(req,res)=>{
    res.render("Users/login.ejs");
}

module.exports.login=async(req,res)=>{
    console.log("post request received");
    req.flash("success","welcome to Airbnb,You are logged in");
    if(res.locals.redirectUrl){
         return res.redirect(res.locals.redirectUrl);
    }
    else{
         return res.redirect("/listings");
    }
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
}