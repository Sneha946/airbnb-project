//MVC FRAMEWORK---MODELS,VIEWS,CONTROLLERS--FULL STACK PROJECT IMPLEMENTATION USING MVC
const Listing=require("../model/Listing.js");

//INDEX ROUTE
module.exports.index=async(req,res)=>{
    let allListings=await Listing.find({});
    res.render("Listings/index.ejs",{allListings});
    
}

//SHOW ROUTE
module.exports.show=async (req,res)=>{
    let {id}=req.params;
    const list=await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        }
    })
    .populate("owner");
    
    if(!list){
        req.flash("error","Listing you requested doesn't exist..");
        res.redirect("/listings");
    }
    res.render("Listings/show.ejs",{list});
}

//NEW ROUTE
module.exports.new=(req,res)=>{
    res.render("Listings/new.ejs");
   
}

//CREATE ROUTE
module.exports.post=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing= new Listing(req.body.listing);
    console.log(req.user);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","new listing created");
    res.redirect("/listings");
}

//EDIT ROUTE
module.exports.edit=async (req,res)=>{
    let{id}=req.params;
    let list=await Listing.findById(id);
    if(!list){
        req.flash("error","Listing you requested doesn't exist..");
        res.redirect("/listings");
    }
    res.render("Listings/edit.ejs",{list});
}


//UPDATE ROUTE
module.exports.update=async (req,res)=>{
    let {id}=req.params;
    
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!=='undefined'){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    
    
    req.flash("success","listing updated successfully..");
    res.redirect(`/listings/show/${id}`);
}

//DELETE ROUTE
module.exports.delete=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted successfully...");
    res.redirect("/listings");
}