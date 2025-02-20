import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.listen(process.env.PORT,()=>{
    console.log("Server is running on port "+process.env.PORT);
mongoose.connect(process.env.CNX_MONGO)
.then(()=>{
    console.log("Connected to mongodb");
})
.catch((err)=>
    console.log(err)) 
})

