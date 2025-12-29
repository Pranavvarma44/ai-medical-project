import express from "express";
import axios from "axios";
import multer from "multer";
import protect from "../middleware/authMiddleware.js";
import Scan from "../models/Scan.js";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

router.get("/my",protect,async(req,res)=>{
  try{
    const scans=await Scan.find({user:req.userId}).sort({createdAt:-1});
    res.json({scans});
  }catch(error){
    res.status(500).json({ message: "Failed to fetch scans" });
  }
})

router.get("/:id",protect,async(req,res)=>{
  try{
    const scan=await Scan.findById(req.params.id);
    if(!scan){
      return res.status(404).json({ message: "Scan not found" });
    }
    res.json(scan);
  }catch(err){
    res.status(500).json({message:"server error"});

  }
});

router.post(
  "/predict",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // 🔁 Call FastAPI
      const pythonResponse = await axios.post(
        "http://localhost:8000/predict",
        {
          image_path: `${process.cwd()}/${req.file.path}`
        }
      );
      console.log("PYTHON RESPONSE:", pythonResponse.data);

      const {
        predictedClass,
        predictions,
        confidence,
      } = pythonResponse.data;

      // 🧪 Debug (TEMP — REMOVE LATER)
      console.log("PYTHON RESPONSE:", pythonResponse.data);

      // 💾 Save to DB
      const scan = await Scan.create({
        user: req.userId,          // ✅ FIXED
        imageUrl: req.file.path,     // ✅ MATCH SCHEMA
        predictedClass,
        confidence,
        predictions,
      });

      res.status(200).json({
        message: "Prediction successful",
        scan,
      });
    } catch (error) {
      console.error("FULL ERROR:", error);
      res.status(500).json({
        error: "Prediction failed",
        details: error.message,
      });
    }
  }
);

export default router;