require('dotenv').config()

const express=require("express");
const mongoose=require("mongoose");
const app=express();
const port=3000;
//const MONGO_URL="mongodb://127.0.0.1:27017/airbnb";
const db_url=process.env.AtLASDB_URL;
//Models
const Listing=require("./model/Listing.js");
const Review=require("./model/Review.js");
const User=require("./model/User.js");

const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "public")));

//Handling Errors
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");

//Routers
const  listingRouter=require("./routes/listings.js");
const  reviewRouter=require("./routes/reviews.js");
const userRoute=require("./routes/users.js")

//session
const session=require("express-session");
const flash=require("connect-flash");
const MongoStore=require("connect-mongo");
//Passport
const passport=require("passport");
const LocalStrategy=require("passport-local");

main()
.then(()=>{console.log("database connected..")})
.catch((error)=>{console.log(error)})


async function main(){
    await mongoose.connect(db_url);
};
//session information is stored on atlas
const store=MongoStore.create({
    mongoUrl:db_url,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})
store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
})
const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,//number of imilisecond -->1 week
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    // if(res.locals.success)console.log(req.path+" "+res.locals.success);
    // if(res.locals.error)console.log(req.path+" "+res.locals.error);
    res.locals.currentUser=req.user;

    next();
   
})

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRoute);

app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err;
    console.log(err);
    res.status(statusCode).render("error.ejs",{err});
})
app.listen(port,()=>{
    console.log(`app is listening at port ${port}`); 
});