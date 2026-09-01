const pool = require("../config/db");

/*
=====================================================
CREATE JOB
POST /api/jobs
=====================================================
*/
const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      location,
      salary,
      job_type
    } = req.body;

    if (
      !title ||
      !company ||
      !description ||
      !location ||
      !job_type
    ) {
      return res.status(400).json({
        success: false,
        message: "Required job fields are missing"
      });
    }

    const recruiterId = req.user.id;

    const result = await pool.query(
      `INSERT INTO jobs
      (
        title,
        company,
        description,
        location,
        salary,
        job_type,
        recruiter_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        title,
        company,
        description,
        location,
        salary || null,
        job_type,
        recruiterId
      ]
    );

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: result.rows[0]
    });

  } catch (error) {
    console.error("Create job error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create job"
    });
  }
};


/*
=====================================================
GET ALL JOBS
GET /api/jobs
=====================================================
*/
const getAllJobs = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        j.id,
        j.title,
        j.company,
        j.description,
        j.location,
        j.salary,
        j.job_type,
        j.recruiter_id,
        j.created_at,
        u.name AS recruiter_name,
        u.email AS recruiter_email
      FROM jobs j
      LEFT JOIN users u
        ON j.recruiter_id = u.id
      ORDER BY j.created_at DESC`
    );

    res.json({
      success: true,
      count: result.rows.length,
      jobs: result.rows
    });

  } catch (error) {
    console.error("Get jobs error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs"
    });
  }
};


/*
=====================================================
GET SINGLE JOB
GET /api/jobs/:id
=====================================================
*/
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
        j.id,
        j.title,
        j.company,
        j.description,
        j.location,
        j.salary,
        j.job_type,
        j.recruiter_id,
        j.created_at,
        u.name AS recruiter_name,
        u.email AS recruiter_email
      FROM jobs j
      LEFT JOIN users u
        ON j.recruiter_id = u.id
      WHERE j.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    res.json({
      success: true,
      job: result.rows[0]
    });

  } catch (error) {
    console.error("Get job error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch job"
    });
  }
};


/*
=====================================================
UPDATE JOB
PUT /api/jobs/:id
=====================================================
*/
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      company,
      description,
      location,
      salary,
      job_type
    } = req.body;

    const recruiterId = req.user.id;

    const existingJob = await pool.query(
      `SELECT *
       FROM jobs
       WHERE id = $1`,
      [id]
    );

    if (existingJob.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    if (
      String(existingJob.rows[0].recruiter_id) !==
      String(recruiterId)
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own jobs"
      });
    }

    const result = await pool.query(
      `UPDATE jobs
       SET
         title = $1,
         company = $2,
         description = $3,
         location = $4,
         salary = $5,
         job_type = $6
       WHERE id = $7
       RETURNING *`,
      [
        title,
        company,
        description,
        location,
        salary || null,
        job_type,
        id
      ]
    );

    res.json({
      success: true,
      message: "Job updated successfully",
      job: result.rows[0]
    });

  } catch (error) {
    console.error("Update job error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update job"
    });
  }
};


/*
=====================================================
DELETE JOB
DELETE /api/jobs/:id
=====================================================
*/
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const recruiterId = req.user.id;

    const existingJob = await pool.query(
      `SELECT *
       FROM jobs
       WHERE id = $1`,
      [id]
    );

    if (existingJob.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    if (
      String(existingJob.rows[0].recruiter_id) !==
      String(recruiterId)
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own jobs"
      });
    }

    await pool.query(
      `DELETE FROM jobs
       WHERE id = $1`,
      [id]
    );

    res.json({
      success: true,
      message: "Job deleted successfully"
    });

  } catch (error) {
    console.error("Delete job error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete job"
    });
  }
};


module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob
};