const pool = require("../config/db");

// APPLY FOR JOB
const applyForJob = async (req, res) => {
  try {
    const { job_id } = req.body;
    const userId = req.user.id;

    if (!job_id) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required"
      });
    }

    // Check whether job exists
    const jobResult = await pool.query(
      `SELECT id
       FROM jobs
       WHERE id = $1`,
      [job_id]
    );

    if (jobResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    // Check duplicate application
    const existingApplication = await pool.query(
      `SELECT id
       FROM applications
       WHERE job_id = $1
       AND user_id = $2`,
      [job_id, userId]
    );

    if (existingApplication.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job"
      });
    }

    // Create application
    const result = await pool.query(
      `INSERT INTO applications
       (job_id, user_id, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [job_id, userId, "pending"]
    );

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: result.rows[0]
    });

  } catch (error) {
    console.error("Apply job error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit application"
    });
  }
};


// GET MY APPLICATIONS
const getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT
        a.id,
        a.job_id,
        a.user_id,
        a.status,
        a.applied_at,
        j.title,
        j.company,
        j.location,
        j.job_type
      FROM applications a
      JOIN jobs j
        ON a.job_id = j.id
      WHERE a.user_id = $1
      ORDER BY a.applied_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      count: result.rows.length,
      applications: result.rows
    });

  } catch (error) {
    console.error("Get applications error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch applications"
    });
  }
};


// GET RECRUITER APPLICATIONS
const getRecruiterApplications = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    const result = await pool.query(
      `SELECT
        a.id,
        a.job_id,
        a.user_id,
        a.status,
        a.applied_at,
        j.title,
        j.company,
        u.name AS applicant_name,
        u.email AS applicant_email
      FROM applications a
      JOIN jobs j
        ON a.job_id = j.id
      JOIN users u
        ON a.user_id = u.id
      WHERE j.recruiter_id = $1
      ORDER BY a.applied_at DESC`,
      [recruiterId]
    );

    res.json({
      success: true,
      count: result.rows.length,
      applications: result.rows
    });

  } catch (error) {
    console.error("Get recruiter applications error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch recruiter applications"
    });
  }
};

// UPDATE APPLICATION STATUS
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const recruiterId = req.user.id;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status"
      });
    }

    // Check application belongs to recruiter's job
    const applicationResult = await pool.query(
      `SELECT
        a.id,
        j.recruiter_id
      FROM applications a
      JOIN jobs j
        ON a.job_id = j.id
      WHERE a.id = $1`,
      [id]
    );

    if (applicationResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    if (
      String(applicationResult.rows[0].recruiter_id) !==
      String(recruiterId)
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only update applications for your own jobs"
      });
    }

    const result = await pool.query(
      `UPDATE applications
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    res.json({
      success: true,
      message: "Application status updated successfully",
      application: result.rows[0]
    });

  } catch (error) {
    console.error("Update application status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update application status"
    });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getRecruiterApplications,
  updateApplicationStatus
};