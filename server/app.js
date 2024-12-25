import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cors from 'cors';
import connectDB from './db/connectDB.js';
import candidateRoutes from "./routes/candidateRoutes.js"
import upload from './middlewares/upload-middleware.js';

const app = express();
const port = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL

// CORS Policy 
app.use(cors())

// Connect DB 
connectDB(DATABASE_URL)

// Static file display
app.use(express.static('public/uploads/pimage'))
app.use(express.static('public/uploads/rdoc'))

// For Parsing application/json
app.use(express.json())

// App Level Middleware - For Parsing multipart/ Form-Data
// app.use(upload.fields([{ name : 'pimage', maxCount: 1},{ name : 'rdoc', maxCount: 1} ]))

// Load Routes
app.use("/api", candidateRoutes)

app.listen(port, ()=> {
    console.log(`Server running on ${port}`)
})