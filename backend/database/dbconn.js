import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()


const ConnDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("✅ Connection Successfull!");
        
    } catch (err) {
        throw new Error("❌ Error Connecting to the Database🥲")
    }
}


export default ConnDB