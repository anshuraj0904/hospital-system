import mongoose from "mongoose";


const feedbackSchema = new mongoose.Schema({
    treatmentId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"treatment",
        required:true
    },

    feedbackStatement:{type:String, required:true},
    reportToAdmin:{type:Boolean, default:false}
})