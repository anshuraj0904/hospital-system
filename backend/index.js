import express from "express"
import cors from "cors"
import ConnDB from "./database/dbconn.js"
import cookieParser from "cookie-parser"

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(cookieParser())
app.use(cors())



const startServer = async() =>{
   await ConnDB().then(()=>{
    app.listen(port,()=>{
        console.log(`App running on http://localhost:${port}`);                   
    })
   })
   .catch(e =>{
    console.log(e);
    process.exit(1)
   })
}


startServer()