const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../model/Listing.js");
const {listingSchema}=require("../schema.js");
const {isloggedIn,isOwner,validateListing}=require("../middleware.js");


const listingController=require("../controllers/control-listings.js");
const multer  = require('multer');
const {storage}=require("../cloud-config.js");
const upload = multer({ storage});


router.route("/")
    //Index Route--Shows All Listing
    .get(wrapAsync(listingController.index))
    //CREATE ROUTE-->validateListing as a middleware
    .post(
        isloggedIn,
        
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.post)
    );


router.route("/:id")
    //UPDATE ROUTE
    .put(
        isloggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.update)
    )
    //DELETE ROUTE
    .delete(
        isloggedIn,
        isOwner,
        wrapAsync(listingController.delete)
    );


//Show Route --Show in detail about each Listing
router.get("/show/:id",wrapAsync(listingController.show));

//NEW ROUTE
router.get("/new",isloggedIn,listingController.new);

//Edit Route
router.get("/:id/edit",isloggedIn,isOwner,wrapAsync(listingController.edit));

module.exports=router;