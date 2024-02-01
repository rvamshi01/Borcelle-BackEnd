const express = require("express")
const dotenv= require("dotenv").config()
const app = express()
const cors = require('cors');
const connect=require("./dbConnection")
connect()
app.use(express.json())
app.use(cors())
app.use("/auth",require("./routes/Authentication"))
app.use("/products",require("./routes/Products"))
app.listen(process.env.PORT,()=>{
    console.log("listening on port: ",process.env.PORT)
})
 