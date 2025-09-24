import mongoose from "mongoose";


const feedbackSchema = new mongoose.Schema({
    treatmentId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Treatment",
        required:true
    },

    feedbackStatement:{type:String, required:true},
    reportToAdmin:{type:Boolean, default:false}
})


export default mongoose.model("Feedback", feedbackSchema)