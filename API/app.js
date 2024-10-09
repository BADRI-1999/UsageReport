import express from "express";
import route from "./routes/route.js";  
import cors from "cors";  // Import the CORS package

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Use CORS middleware
app.use(cors({
    origin: 'http://localhost:4200', // Allow requests from your Angular app
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify allowed methods
    credentials: true // Allow credentials (like cookies) to be sent
}));

// Use the routes
app.use(route);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
