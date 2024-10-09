
import express from "express";
import checkJwt from "../middleware/auth.js";  

const router = express.Router();

// Define protected route
router.get("/api/protected", checkJwt, (req, res) => {
  console.log("Protected route accessed");
  res.status(200).json({
    message: "welcome"
  })
});

export default router;
