const express = require("express");

const router = express.Router();

const {
  applyForJob,
  getMyApplications,
  getRecruiterApplications,
  updateApplicationStatus
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");

// Apply for a job
router.post(
  "/",
  authMiddleware,
  applyForJob
);

// Get my applications - Jobseeker
router.get(
  "/my",
  authMiddleware,
  getMyApplications
);

// Get applications for recruiter's jobs
router.get(
  "/recruiter",
  authMiddleware,
  getRecruiterApplications
);

// Update application status - Recruiter
router.put(
  "/:id/status",
  authMiddleware,
  updateApplicationStatus
);

module.exports = router;