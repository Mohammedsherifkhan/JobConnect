import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../Dashboard.css";

function RecruiterDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const loadDashboard = () => {
    const savedUser = localStorage.getItem(
      "jobconnect_current_user"
    );

    if (!savedUser) {
      navigate("/login");
      return;
    }

    const currentUser = JSON.parse(savedUser);

    if (currentUser.role !== "recruiter") {
      navigate("/");
      return;
    }

    setUser(currentUser);

    // Get recruiter jobs
    const savedJobs =
      JSON.parse(
        localStorage.getItem("jobconnect_jobs")
      ) || [];

    const recruiterJobs = savedJobs.filter(
      (job) =>
        String(job.recruiterId) ===
        String(currentUser.id)
    );

    setJobs(recruiterJobs);

    // Get all applications
    const savedApplications =
      JSON.parse(
        localStorage.getItem(
          "jobconnect_applications"
        )
      ) || [];

    // Applications for recruiter's jobs
    const recruiterApplications =
      savedApplications.filter((application) =>
        recruiterJobs.some(
          (job) =>
            String(job.id) ===
            String(application.jobId)
        )
      );

    setApplications(recruiterApplications);
  };

  useEffect(() => {
    loadDashboard();

    window.addEventListener(
      "jobPosted",
      loadDashboard
    );

    window.addEventListener(
      "applicationsUpdated",
      loadDashboard
    );

    return () => {
      window.removeEventListener(
        "jobPosted",
        loadDashboard
      );

      window.removeEventListener(
        "applicationsUpdated",
        loadDashboard
      );
    };
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-page">

      <div className="dashboard-container">

        {/* ================= HEADER ================= */}

        <div className="dashboard-header">

          <div>

            <span className="dashboard-label">
              RECRUITER DASHBOARD
            </span>

            <h1>
              Welcome, {user.name} 👋
            </h1>

            <p>
              Manage your jobs and applications.
            </p>

          </div>

          <button
            className="dashboard-post-btn"
            onClick={() =>
              navigate("/post-job")
            }
          >
            + Post New Job
          </button>

        </div>


        {/* ================= STATISTICS ================= */}

        <div className="dashboard-stats">

          {/* TOTAL JOBS */}

          <div className="stat-card">

            <div className="stat-icon">
              💼
            </div>

            <div>

              <span>
                Total Jobs
              </span>

              <strong>
                {jobs.length}
              </strong>

            </div>

          </div>


          {/* APPLICATIONS */}

          <div className="stat-card">

            <div className="stat-icon">
              📄
            </div>

            <div>

              <span>
                Applications
              </span>

              <strong>
                {applications.length}
              </strong>

            </div>

          </div>


          {/* ACTIVE JOBS */}

          <div className="stat-card">

            <div className="stat-icon">
              ✓
            </div>

            <div>

              <span>
                Active Jobs
              </span>

              <strong>
                {jobs.length}
              </strong>

            </div>

          </div>

        </div>


        {/* ================= POSTED JOBS ================= */}

        <div className="dashboard-section">

          <div className="section-title">

            <h2>
              My Posted Jobs
            </h2>

            <p>
              Jobs posted by your account
            </p>

          </div>


          {jobs.length === 0 ? (

            <div className="empty-dashboard">

              <div className="empty-icon">
                💼
              </div>

              <h3>
                No jobs posted yet
              </h3>

              <p>
                Create your first job posting
                to start receiving applications.
              </p>

              <button
                onClick={() =>
                  navigate("/post-job")
                }
              >
                Post a Job
              </button>

            </div>

          ) : (

            <div className="recruiter-jobs">

              {jobs.map((job) => {

                // Count applications for this job

                const jobApplications =
                  applications.filter(
                    (application) =>
                      String(
                        application.jobId
                      ) === String(job.id)
                  );

                return (

                  <div
                    className="recruiter-job-card"
                    key={job.id}
                  >

                    {/* JOB INFORMATION */}

                    <div className="recruiter-job-info">

                      <span className="job-type-badge">
                        {job.type}
                      </span>

                      <h3>
                        {job.title}
                      </h3>

                      <p>
                        {job.company}
                      </p>

                      <div className="job-meta">

                        <span>
                          📍 {job.location}
                        </span>

                        <span>
                          💼 {job.experience}
                        </span>

                        <span>
                          💰 {job.salary}
                        </span>

                      </div>

                    </div>


                    {/* APPLICATION INFORMATION */}

                    <div className="job-application-info">

                      <strong>
                        {jobApplications.length}
                      </strong>

                      <span>
                        Applications
                      </span>

                      <button
                        onClick={() =>
                          navigate(
                            `/applications/${job.id}`
                          )
                        }
                      >
                        View Applications
                      </button>

                    </div>

                  </div>

                );
              })}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default RecruiterDashboard;