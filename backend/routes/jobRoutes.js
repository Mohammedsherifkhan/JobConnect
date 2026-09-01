const express = require("express");

const router = express.Router();

const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob
} = require("../controllers/jobController");

const authMiddleware = require("../middleware/authMiddleware");

// Get all jobs
router.get("/", getAllJobs);

// Get single job
router.get("/:id", getJobById);

// Create job
router.post("/", authMiddleware, createJob);

// Update job
router.put("/:id", authMiddleware, updateJob);

// Delete job
router.delete("/:id", authMiddleware, deleteJob);

module.exports = router;