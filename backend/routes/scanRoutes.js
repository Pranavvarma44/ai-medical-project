import express from "express";
import axios from "axios";
import multer from "multer";
import fs from "fs";
import FormData from "form-data";
import protect from "../middleware/authMiddleware.js";
import Scan from "../models/Scan.js";

const router = express.Router();

/* =========================
   MULTER CONFIG
========================= */
const upload = multer({
  dest: "uploads/",
});

/* =========================
   POST /api/scans/predict
========================= */
router.post(
  "/predict",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      /* =========================
         SEND IMAGE FILE TO COLAB
      ========================= */
      const formData = new FormData();

      // ✅ MUST BE "image" (matches FastAPI)
      formData.append(
        "image",
        fs.createReadStream(req.file.path)
      );

      const pythonResponse = await axios.post(
        "https://precedential-lavera-unconformable.ngrok-free.dev/predict",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          timeout: 30000,
        }
      );

      console.log("🐍 COLAB RESPONSE:", pythonResponse.data);

      const {
        predictedClass,
        confidence,
        predictions,
      } = pythonResponse.data;

      /* =========================
         SAVE TO DATABASE
      ========================= */
      const scan = await Scan.create({
        user: req.userId,
        imageUrl: req.file.path,
        predictedClass,
        confidence,
        predictions,
      });

      return res.status(200).json({
        message: "Prediction successful",
        scan,
      });
    } catch (error) {
      console.error(
        "❌ SCAN ERROR:",
        error.response?.data || error.message
      );

      return res.status(500).json({
        message: "Prediction failed",
        error: error.response?.data || error.message,
      });
    }
  }
);

/* =========================
   GET USER SCANS
========================= */
router.get("/my", protect, async (req, res) => {
  try {
    const scans = await Scan.find({ user: req.userId }).sort({
      createdAt: -1,
    });

    res.json({ scans });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch scans" });
  }
});

/* =========================
   GET SINGLE SCAN
========================= */
router.get("/:id", protect, async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id);

    if (!scan) {
      return res.status(404).json({ message: "Scan not found" });
    }

    res.json(scan);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   DELETE SCAN
========================= */
router.delete("/:id", protect, async (req, res) => {
  try {
    await Scan.findByIdAndDelete(req.params.id);
    res.json({ message: "Scan deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete scan" });
  }
});

export default router;