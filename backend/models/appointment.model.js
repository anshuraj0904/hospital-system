import mongoose from "mongoose";


const appointementSchema = new mongoose.Schema({
   doctorId :{
    type: mongoose.Schema.Types.ObjectId,
    ref:"user",
    default:null,
    required:true
   } ,
   patientId :{
    type: mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true
   },
   issue:{type: String, required:true},
   isAssigned: { type: Boolean, default: false },
   status:{
    type: String,
    enum : ["open","in-progress","closed"],
    default:"open"
   }

},{timestamps:true})


export default mongoose.model({"Appointment": appointementSchema})