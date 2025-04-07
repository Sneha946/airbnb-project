const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const Listing=require("../model/Listing.js");
const Review=require("../model/Review.js");
const {isloggedIn,isAuthor}=require("../middleware.js");
const {validateReview}=require("../middleware.js");
const reviewControl=require("../controllers/control-reviews.js");

//Create review route
router.post("/",isloggedIn,validateReview,wrapAsync(async (req,res)=>{
    
    console.log("request review recieved...");
    
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    
    
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","review added successfully..");
    res.redirect(`/listings/show/${id}`);


}));

//DELETE REVIEW ROUTE
//PULL OPERATOR
router.delete("/:reviewId",isloggedIn,isAuthor,wrapAsync(async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted successfully..");

    res.redirect(`/listings/show/${id}`);
        

}));
module.exports=router;