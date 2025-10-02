import express from 'express'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js'
import candidateRoutes from './routes/candidateRoutes.js'
import connectDB from './db.js'
import dotenv from "dotenv";
import { jwtAuthMiddleware } from './jwt.js';
// import candidate from './models/candidate.js';

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// CORS configuration - Add this before other middleware
const corsOptions = {
  origin: [
    'http://localhost:3000',  // Your React dev server
    'http://localhost:5173',  // Vite default port
    'https://your-frontend-domain.com'  // Production frontend URL
  ],
  credentials: true,  // Allow cookies/auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};


app.use(cors(corsOptions));  // Apply CORS middleware
connectDB();

app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes)
app.listen(PORT,()=>{
    console.log('Listeing onn port 3000');
})