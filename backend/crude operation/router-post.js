require('dotenv').config(); // to config the .env file 
const express = require("express");
const mongoose = require('mongoose'); 
const router = express.Router();
const Autoincrement = require("mongoose-sequence")(mongoose); // import the autoincrement as-built module
// connect the serer (node Js) with mongoDB atlas
mongoose.connect(process.env.MONGO_URL, {family: 4}) 
.then(()=>console.log("Conneted to MongoDB Atlas"))
.catch(err=>console.error('Connection failed', err)) 


// create shema
const registrationSchema = new mongoose.Schema({
    fullName: {type: String, required: true},
    phone: {type: String, required: true},
    email: {type: String, required: true},
    course: {type: String, required: true}    
}); 

 //---------insert "User_id" field and make autoincrement for each data inserted from client/fromtend-------
//--------inc_field is plugin expexted object key
// ---- Always apply the plugin before creating the model:
registrationSchema.plugin(Autoincrement, {inc_field: "StudentId"}); 
// creating "schoolRegister" collection in the mongodb and class for creating an instance object template(data from client e.g: req.body).
const student = mongoose.model("studentRegister", registrationSchema); 

// making the userId to be set 1 and autoincrement if there is no documnet in the collection
async function resetCounterIfEmpty() { 
  const count = await student.countDocuments(); // this shows the value of seq in counters collection in mongodb, it indicates the heighest "UserId" or the number of documents in the "studentregisters" collection in mongoDB database
  if (count === 0) {
    // Reset the counter for "UserId"
    await mongoose.connection.collection("_counters").updateOne( // _counters default mongoose can know
      { _id: `${student.collection.name}_StudentId` }, // <-- must match collection name + field exactly
      { $set: { seq: 0 } },
      { upsert: true } // insert if it is not exist update if it is exixt
    );
  }
} 

router.post("/submit", async (req,res)=>{
    try{
    const fullNameNoExtraSpace = req.body.fullName.trim().replace(/\s+/g, " ") //avoiding extra space from name from client/frontend  
    const {phone, email, course} = req.body;
    const existData = await student.findOne({$or: [{fullName:{$regex: `$^{fullNameNoExtraSpace}$`, $options: "i"}}, {email}, {phone}, {course}]});

    //check fullname, phone number and email are already exist first
      if(existData){
        if(existData.fullName.toLowerCase()===fullNameNoExtraSpace.toLowerCase() && existData.phone === phone && existData.email === email){
       return res.json({Msg: "Your fullname, phone number and email you entered already exist!"})

        } else if(existData.fullName.toLowerCase()===fullNameNoExtraSpace.toLowerCase() && existData.phone === phone){
           return res.json({Msg: "Your fullname and phone number you entered already exist!"})

        } else if(existData.fullName.toLowerCase()===fullNameNoExtraSpace.toLowerCase() && existData.email === email){
          return res.json({Msg: "Your fullname and email you entered already exist!"})

        } else if(existData.phone === phone && existData.email === email){
            return res.json({Msg: "Your phone number and email you entered already exist!"})

        } else if(existData.fullName.toLowerCase()===fullNameNoExtraSpace.toLowerCase()){
           return res.json({Msg: "The fullname you entered already exists!"
        })

      } else if(existData.phone === phone){
      return res.json({Msg: "The phone number you entered already exists!"})

      } else if(existData.email === email){
       return res.json({Msg: "The email you entered already exists!"})

      }
       }

        await resetCounterIfEmpty() //calling the function to reset the "UserId"
      // create an instance object template from class and insert data from client e.g: req.body
        const newStudent = new student({fullName: fullNameNoExtraSpace, phone, email, course}); // creating object from class
       await newStudent.save(); // enable the data to save by mongoose and send to mongoDB as BJSON data type.
        res.status(200).json({ Msg: "You are registered successfully" }); // ✅send JSON this is manadatory to work the front end correctly nice!
          
    }catch(err){
        res.status(500).json({Msg: "internal server error or problem on database connection"});
    }
});


module.exports = router;