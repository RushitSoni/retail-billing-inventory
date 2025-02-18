const express = require('express')
const  app = express()
const  dotenv = require('dotenv')
const connectMongoDB = require('./Connection')
const cors = require('cors')
dotenv.config()
const PORT = process.env.PORT

app.use(cors());
app.use(express.json());

//Connect to MongoDB
connectMongoDB()

app.get('/',(req,res)=>{
    res.send("Hello! Rushit Soni")
})



app.listen(PORT,()=>{
    console.log(`Server started at http://localhost:${PORT}`)
})