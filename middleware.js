const  Listing=require("./model/Listing.js");
const Review = require("./model/Review.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");
module.exports.isloggedIn=(req,res,next)=>{
    
    if(!req.isAuthenticated()){
        //redeirect url save
        // console.log("path:"+req. originalUrl);
        req.session.redirectUrl=req.originalUrl;
        // console.log(req.session.redirectUrl);
        req.flash("error","please logged in first");
        return res.redirect("/login");
    }
    next();
       
}

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
        if(error){
            let errorMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errorMsg);
        }
        else{
            next();
        }
}
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
        if(error){
            let errorMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errorMsg);
        }
        else{
            next();
        }
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
        console.log("res.locals.redirectUrl"+res.locals.redirectUrl);
    }
    next();
}

module.exports.isOwner=async (req,res,next)=>{
    //if request is sent through hopscotch
    let {id}=req.params;
    console.log(id);
    let listings=await Listing.findById(id);
    if(!listings.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/show/${id}`);
    }
    next();
}
module.exports.isAuthor=async(req,res,next)=>{
    //if request is sent through hopscotch
    let {id,reviewId}=req.params;
    console.log(id);
    let reviews=await Review.findById(reviewId);
    if(!reviews.author._id.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/show/${id}`);
    }
    next();
}