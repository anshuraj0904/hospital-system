import mongoose, { Mongoose } from "mongoose";


const feedbackSchema = new mongoose.Schema({
    treatmentId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Treatment",
        required:true
    },
    patientId : {
        type: Mongoose.Schema.Types.ObjectId,
        red:"User",
        required:true
    },
    feedbackStatement:{type:String, required:true},
    reportToAdmin:{type:Boolean, default:false, required:true}
})


export default mongoose.model("Feedback", feedbackSchema)