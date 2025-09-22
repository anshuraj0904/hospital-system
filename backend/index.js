import express from "express"
import cors from "cors"
import ConnDB from "./database/dbconn.js"


const app = express()
const port = process.env.PORT

app.use(cors())
app.use(express.json())



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