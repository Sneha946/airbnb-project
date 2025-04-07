const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../model/Listing.js");
const MONGO_URL="mongodb://127.0.0.1:27017/airbnb";

main()
.then(()=>{console.log("database connected..")})
.catch(()=>{console.log(error)})

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"67d1d09ac8f33f563b85da9a"}));
    await Listing.insertMany(initData.data);
    console.log("data was intialized");
}
initDB();
