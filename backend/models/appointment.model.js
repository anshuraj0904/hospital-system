import mongoose from "mongoose";


const appointementSchema = new mongoose.Schema({
   doctorId :{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    default:null,
    required:true
   } ,
   patientId :{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
   },
   issue:{type: String, required:true},
   isAssigned: { type: Boolean, default: false },
   specialization: {type: String, default:null},
   status:{
    type: String,
    enum : ["open","in-progress","closed", "cancelled"],
    default:"open"
   }

},{timestamps:true})


export default mongoose.model("Appointment", appointementSchema)