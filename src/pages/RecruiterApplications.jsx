import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "../Dashboard.css";

function RecruiterApplications() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);

  /* =========================================
     LOAD APPLICATIONS
  ========================================= */

  const loadApplications = () => {
    const savedUser = localStorage.getItem(
      "jobconnect_current_user"
    );

    if (!savedUser) {
      navigate("/login");
      return;
    }

    let currentUser;

    try {
      currentUser = JSON.parse(savedUser);
    } catch (error) {
      console.error("Invalid user data:", error);
      navigate("/login");
      return;
    }

    if (currentUser.role !== "recruiter") {
      navigate("/");
      return;
    }

    /* =========================================
       LOAD JOBS
    ========================================= */

    let savedJobs = [];

    try {
      savedJobs =
        JSON.parse(
          localStorage.getItem("jobconnect_jobs")
        ) || [];
    } catch (error) {
      console.error("Failed to load jobs:", error);
    }

    const selectedJob = savedJobs.find(
      (item) =>
        String(item.id) === String(jobId) &&
        String(item.recruiterId) ===
          String(currentUser.id)
    );

    if (!selectedJob) {
      setJob(null);
      setApplications([]);
      return;
    }

    setJob(selectedJob);

    /* =========================================
       LOAD APPLICATIONS
    ========================================= */

    let savedApplications = [];

    try {
      savedApplications =
        JSON.parse(
          localStorage.getItem(
            "jobconnect_applications"
          )
        ) || [];
    } catch (error) {
      console.error(
        "Failed to load applications:",
        error
      );
    }

    const jobApplications =
      savedApplications.filter(
        (application) =>
          String(application.jobId) ===
          String(jobId)
      );

    setApplications(jobApplications);
  };

  useEffect(() => {
    loadApplications();

    window.addEventListener(
      "applicationsUpdated",
      loadApplications
    );

    return () => {
      window.removeEventListener(
        "applicationsUpdated",
        loadApplications
      );
    };
  }, [jobId]);

  /* =========================================
     UPDATE APPLICATION STATUS
  ========================================= */

  const updateApplicationStatus = (
    applicationId,
    newStatus
  ) => {
    let savedApplications = [];

    try {
      savedApplications =
        JSON.parse(
          localStorage.getItem(
            "jobconnect_applications"
          )
        ) || [];
    } catch (error) {
      console.error(
        "Failed to load applications:",
        error
      );
    }

    const updatedApplications =
      savedApplications.map(
        (application) => {
          if (
            String(application.id) ===
            String(applicationId)
          ) {
            return {
              ...application,
              status: newStatus,
              statusUpdatedAt:
                new Date().toLocaleString(),
            };
          }

          return application;
        }
      );

    localStorage.setItem(
      "jobconnect_applications",
      JSON.stringify(
        updatedApplications
      )
    );

    setApplications(
      updatedApplications.filter(
        (application) =>
          String(application.jobId) ===
          String(jobId)
      )
    );

    window.dispatchEvent(
      new Event("applicationsUpdated")
    );
  };

  /* =========================================
     VIEW RESUME
  ========================================= */

  const viewResume = (application) => {
    const resume = application.resume;

    if (!resume?.data) {
      alert(
        "No resume was attached to this application."
      );
      return;
    }

    const newWindow = window.open(
      "",
      "_blank"
    );

    if (!newWindow) {
      alert(
        "Please allow pop-ups to view the resume."
      );
      return;
    }

    /* PDF */

    if (
      resume.type ===
        "application/pdf" ||
      /\.pdf$/i.test(resume.name)
    ) {
      newWindow.location.href =
        resume.data;

      return;
    }

    /* DOC / DOCX */

    newWindow.document.write(`
      <!DOCTYPE html>

      <html>

        <head>

          <title>
            ${resume.name}
          </title>

        </head>

        <body
          style="
            font-family: Arial, sans-serif;
            padding: 40px;
            text-align: center;
          "
        >

          <h2>
            ${resume.name}
          </h2>

          <p>
            DOC/DOCX files cannot be
            previewed directly in the browser.
          </p>

          <p>
            Please download the resume
            to open it.
          </p>

        </body>

      </html>
    `);

    newWindow.document.close();
  };

  /* =========================================
     DOWNLOAD RESUME
  ========================================= */

  const downloadResume = (application) => {
    const resume = application.resume;

    if (!resume?.data) {
      alert(
        "No resume was attached to this application."
      );
      return;
    }

    const link =
      document.createElement("a");

    link.href = resume.data;

    link.download =
      resume.name || "resume";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  /* =========================================
     JOB NOT FOUND
  ========================================= */

  if (!job) {
    return (
      <div className="dashboard-page">

        <div className="dashboard-container">

          <div className="empty-dashboard">

            <div className="empty-icon">
              💼
            </div>

            <h2>
              Job not found
            </h2>

            <p>
              This job does not belong to
              your recruiter account.
            </p>

            <button
              onClick={() =>
                navigate(
                  "/recruiter-dashboard"
                )
              }
            >
              Back to Dashboard
            </button>

          </div>

        </div>

      </div>
    );
  }

  /* =========================================
     STATISTICS
  ========================================= */

  const pendingCount =
    applications.filter(
      (application) =>
        !application.status ||
        application.status === "Applied" ||
        application.status === "Pending" ||
        application.status === "Under Review"
    ).length;

  const acceptedCount =
    applications.filter(
      (application) =>
        application.status ===
        "Accepted"
    ).length;

  const rejectedCount =
    applications.filter(
      (application) =>
        application.status ===
        "Rejected"
    ).length;

  /* =========================================
     PAGE
  ========================================= */

  return (
    <div className="dashboard-page">

      <div className="dashboard-container">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="dashboard-header">

          <div>

            <span className="dashboard-label">
              APPLICATIONS
            </span>

            <h1>
              {job.title}
            </h1>

            <p>
              {job.company} •{" "}
              {job.location}
            </p>

          </div>

          <button
            className="dashboard-post-btn"
            onClick={() =>
              navigate(
                "/recruiter-dashboard"
              )
            }
          >
            ← Back to Dashboard
          </button>

        </div>


        {/* =====================================
            STATISTICS
        ===================================== */}

        <div className="dashboard-stats">

          {/* TOTAL */}

          <div className="stat-card">

            <div className="stat-icon">
              📄
            </div>

            <div>

              <span>
                Total Applications
              </span>

              <strong>
                {applications.length}
              </strong>

            </div>

          </div>


          {/* UNDER REVIEW */}

          <div className="stat-card">

            <div className="stat-icon">
              🔵
            </div>

            <div>

              <span>
                Under Review
              </span>

              <strong>
                {
                  applications.filter(
                    (application) =>
                      application.status ===
                      "Under Review"
                  ).length
                }
              </strong>

            </div>

          </div>


          {/* ACCEPTED */}

          <div className="stat-card">

            <div className="stat-icon">
              ✅
            </div>

            <div>

              <span>
                Accepted
              </span>

              <strong>
                {acceptedCount}
              </strong>

            </div>

          </div>


          {/* REJECTED */}

          <div className="stat-card">

            <div className="stat-icon">
              ❌
            </div>

            <div>

              <span>
                Rejected
              </span>

              <strong>
                {rejectedCount}
              </strong>

            </div>

          </div>

        </div>


        {/* =====================================
            APPLICATIONS
        ===================================== */}

        <div className="dashboard-section">

          <div className="section-title">

            <h2>
              Candidate Applications
            </h2>

            <p>
              Review candidates who applied
              for this position.
            </p>

          </div>


          {applications.length === 0 ? (

            <div className="empty-dashboard">

              <div className="empty-icon">
                📄
              </div>

              <h3>
                No applications yet
              </h3>

              <p>
                Applications for this job
                will appear here.
              </p>

            </div>

          ) : (

            <div className="recruiter-applications">

              {applications.map(
                (application) => {

                  const status =
                    application.status ||
                    "Applied";

                  const hasResume =
                    Boolean(
                      application.resume?.data
                    );

                  return (

                    <div
                      className="recruiter-application-card"
                      key={
                        application.id
                      }
                    >

                      {/* =================================
                          AVATAR
                      ================================= */}

                      <div className="candidate-avatar">

                        {application
                          .candidateName
                          ? application
                              .candidateName
                              .charAt(0)
                              .toUpperCase()
                          : "U"}

                      </div>


                      <div className="candidate-content">

                        {/* ===============================
                            CANDIDATE HEADER
                        =============================== */}

                        <div className="candidate-header">

                          <div>

                            <h3>
                              {application
                                .candidateName ||
                                "Candidate"}
                            </h3>

                            <p>
                              📧{" "}
                              {application
                                .candidateEmail ||
                                application.userEmail ||
                                "No email"}
                            </p>

                          </div>


                          <span
                            className={`application-status status-${status
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )}`}
                          >
                            {status}
                          </span>

                        </div>


                        {/* ===============================
                            DETAILS
                        =============================== */}

                        <div className="candidate-details">

                          <span>
                            📅 Applied:{" "}
                            {application
                              .appliedAt ||
                              "Recently"}
                          </span>

                          {application.experience && (
                            <span>
                              🎓{" "}
                              {
                                application.experience
                              }
                            </span>
                          )}

                          {application.type && (
                            <span>
                              💼{" "}
                              {
                                application.type
                              }
                            </span>
                          )}

                        </div>


                        {/* ===============================
                            RESUME
                        =============================== */}

                        <div className="candidate-resume">

                          <div className="candidate-resume-info">

                            <span className="resume-icon">
                              📄
                            </span>

                            <div>

                              <strong>
                                Resume
                              </strong>

                              {hasResume ? (

                                <small>
                                  {
                                    application
                                      .resume
                                      .name
                                  }
                                </small>

                              ) : (

                                <small>
                                  No resume attached
                                </small>

                              )}

                            </div>

                          </div>


                          {hasResume && (

                            <div className="resume-actions">

                              <button
                                type="button"
                                onClick={() =>
                                  viewResume(
                                    application
                                  )
                                }
                              >
                                👁 View
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  downloadResume(
                                    application
                                  )
                                }
                              >
                                ↓ Download
                              </button>

                            </div>

                          )}

                        </div>


                        {/* ===============================
                            COVER LETTER
                        =============================== */}

                        {application.coverLetter && (

                          <div className="cover-letter">

                            <strong>
                              Cover Letter
                            </strong>

                            <p>
                              {
                                application.coverLetter
                              }
                            </p>

                          </div>

                        )}


                        {/* ===============================
                            STATUS ACTIONS
                        =============================== */}

                        <div className="application-actions">

                          {/* UNDER REVIEW */}

                          <button
                            className="review-btn"
                            onClick={() =>
                              updateApplicationStatus(
                                application.id,
                                "Under Review"
                              )
                            }
                            disabled={
                              status ===
                              "Under Review"
                            }
                          >
                            🔎 Under Review
                          </button>


                          {/* ACCEPT */}

                          <button
                            className="accept-btn"
                            onClick={() =>
                              updateApplicationStatus(
                                application.id,
                                "Accepted"
                              )
                            }
                            disabled={
                              status ===
                              "Accepted"
                            }
                          >
                            ✓ Accept
                          </button>


                          {/* REJECT */}

                          <button
                            className="reject-btn"
                            onClick={() =>
                              updateApplicationStatus(
                                application.id,
                                "Rejected"
                              )
                            }
                            disabled={
                              status ===
                              "Rejected"
                            }
                          >
                            ✕ Reject
                          </button>

                        </div>

                      </div>

                    </div>

                  );
                }
              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default RecruiterApplications;