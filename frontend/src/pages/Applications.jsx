import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Applications.css";

function Applications() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
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
      console.error(
        "Failed to load user:",
        error
      );

      navigate("/login");
      return;
    }

    setUser(currentUser);

    const savedApplications =
      JSON.parse(
        localStorage.getItem(
          "jobconnect_applications"
        )
      ) || [];

    /* Only current candidate applications */

    const userApplications =
      savedApplications.filter(
        (application) =>
          String(application.userId) ===
            String(currentUser.id) ||
          String(application.userEmail) ===
            String(currentUser.email)
      );

    setApplications(userApplications);
  };

  /* =========================================
     EFFECT
  ========================================= */

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
  }, []);

  /* =========================================
     STATUS CLASS
  ========================================= */

  const getStatusClass = (status) => {
    const currentStatus =
      status || "Applied";

    return currentStatus
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  /* =========================================
     CANCEL APPLICATION
  ========================================= */

  const withdrawApplication = (
    applicationId
  ) => {
    const confirmWithdraw =
      window.confirm(
        "Are you sure you want to withdraw this application?"
      );

    if (!confirmWithdraw) {
      return;
    }

    const savedApplications =
      JSON.parse(
        localStorage.getItem(
          "jobconnect_applications"
        )
      ) || [];

    const updatedApplications =
      savedApplications.filter(
        (application) =>
          String(application.id) !==
          String(applicationId)
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
          String(application.userId) ===
            String(user.id) ||
          String(application.userEmail) ===
            String(user.email)
      )
    );

    window.dispatchEvent(
      new Event("applicationsUpdated")
    );

    alert(
      "Application withdrawn successfully."
    );
  };

  /* =========================================
     VIEW RESUME
  ========================================= */

  const viewResume = (application) => {
    if (!application.resume?.data) {
      alert(
        "No resume attached to this application."
      );

      return;
    }

    const newWindow =
      window.open();

    if (!newWindow) {
      alert(
        "Please allow pop-ups to view the resume."
      );

      return;
    }

    if (
      application.resume.type ===
        "application/pdf" ||
      /\.pdf$/i.test(
        application.resume.name
      )
    ) {
      newWindow.location.href =
        application.resume.data;

      return;
    }

    newWindow.document.write(`
      <html>
        <head>
          <title>
            ${application.resume.name}
          </title>
        </head>

        <body
          style="
            font-family: Arial;
            padding: 40px;
            text-align: center;
          "
        >

          <h2>
            ${application.resume.name}
          </h2>

          <p>
            This DOC/DOCX file cannot be
            previewed directly.
          </p>

          <p>
            Download the resume to open it.
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
    if (!application.resume?.data) {
      alert(
        "No resume attached to this application."
      );

      return;
    }

    const link =
      document.createElement("a");

    link.href =
      application.resume.data;

    link.download =
      application.resume.name ||
      "resume";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  /* =========================================
     EMPTY STATE
  ========================================= */

  if (applications.length === 0) {
    return (
      <div className="applications-page">

        <div className="applications-container">

          <div className="applications-header">

            <span>
              MY APPLICATIONS
            </span>

            <h1>
              Applications
            </h1>

            <p>
              Track all your job applications
              in one place.
            </p>

          </div>

          <div className="applications-empty">

            <div className="empty-icon">
              📄
            </div>

            <h2>
              No applications yet
            </h2>

            <p>
              You haven't applied for any jobs
              yet.
            </p>

            <button
              onClick={() =>
                navigate("/")
              }
            >
              Find Jobs
            </button>

          </div>

        </div>

      </div>
    );
  }

  /* =========================================
     MAIN PAGE
  ========================================= */

  return (
    <div className="applications-page">

      <div className="applications-container">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="applications-header">

          <span>
            MY APPLICATIONS
          </span>

          <h1>
            Applications
          </h1>

          <p>
            Track all your job applications
            in one place.
          </p>

        </div>


        {/* =====================================
            STATISTICS
        ===================================== */}

        <div className="application-stats">

          <div className="application-stat">

            <span>
              📄
            </span>

            <div>
              <small>
                Total
              </small>

              <strong>
                {applications.length}
              </strong>
            </div>

          </div>


          <div className="application-stat">

            <span>
              🟡
            </span>

            <div>
              <small>
                Pending
              </small>

              <strong>
                {
                  applications.filter(
                    (application) =>
                      !application.status ||
                      application.status ===
                        "Applied" ||
                      application.status ===
                        "Pending"
                  ).length
                }
              </strong>
            </div>

          </div>


          <div className="application-stat">

            <span>
              ✅
            </span>

            <div>
              <small>
                Accepted
              </small>

              <strong>
                {
                  applications.filter(
                    (application) =>
                      application.status ===
                      "Accepted"
                  ).length
                }
              </strong>
            </div>

          </div>


          <div className="application-stat">

            <span>
              ❌
            </span>

            <div>
              <small>
                Rejected
              </small>

              <strong>
                {
                  applications.filter(
                    (application) =>
                      application.status ===
                      "Rejected"
                  ).length
                }
              </strong>
            </div>

          </div>

        </div>


        {/* =====================================
            APPLICATION LIST
        ===================================== */}

        <div className="applications-list">

          {applications.map(
            (application) => {

              const status =
                application.status ||
                "Applied";

              return (

                <div
                  className="application-card"
                  key={
                    application.id
                  }
                >

                  {/* ==========================
                      JOB HEADER
                  ========================== */}

                  <div className="application-card-header">

                    <div>

                      <span className="application-type">
                        {application.type}
                      </span>

                      <h2>
                        {application.title}
                      </h2>

                      <p>
                        {application.company}
                      </p>

                    </div>


                    <span
                      className={`application-status status-${getStatusClass(
                        status
                      )}`}
                    >
                      {status}
                    </span>

                  </div>


                  {/* ==========================
                      JOB DETAILS
                  ========================== */}

                  <div className="application-details">

                    <span>
                      📍{" "}
                      {application.location}
                    </span>

                    <span>
                      🎓{" "}
                      {application.experience}
                    </span>

                    <span>
                      💰{" "}
                      {application.salary}
                    </span>

                    <span>
                      📅 Applied{" "}
                      {application.appliedAt}
                    </span>

                  </div>


                  {/* ==========================
                      STATUS MESSAGE
                  ========================== */}

                  <div
                    className={`application-status-message status-message-${getStatusClass(
                      status
                    )}`}
                  >

                    {status ===
                      "Accepted" && (
                      <>
                        <strong>
                          🎉 Congratulations!
                        </strong>

                        <p>
                          Your application has
                          been accepted by the
                          recruiter.
                        </p>
                      </>
                    )}


                    {status ===
                      "Rejected" && (
                      <>
                        <strong>
                          Application Update
                        </strong>

                        <p>
                          The recruiter has
                          decided not to proceed
                          with this application.
                        </p>
                      </>
                    )}


                    {(status ===
                      "Applied" ||
                      status ===
                        "Pending" ||
                      !status) && (
                      <>
                        <strong>
                          ⏳ Application Under
                          Review
                        </strong>

                        <p>
                          Your application has
                          been submitted and is
                          waiting for recruiter
                          review.
                        </p>
                      </>
                    )}

                  </div>


                  {/* ==========================
                      RESUME
                  ========================== */}

                  {application.resume?.data && (

                    <div className="application-resume">

                      <div className="application-resume-info">

                        <span>
                          📄
                        </span>

                        <div>

                          <strong>
                            Resume
                          </strong>

                          <small>
                            {
                              application
                                .resume
                                .name
                            }
                          </small>

                        </div>

                      </div>


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

                    </div>

                  )}


                  {/* ==========================
                      COVER LETTER
                  ========================== */}

                  {application.coverLetter && (

                    <div className="application-cover-letter">

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


                  {/* ==========================
                      ACTIONS
                  ========================== */}

                  <div className="application-card-actions">

                    <button
                      type="button"
                      onClick={() =>
                        withdrawApplication(
                          application.id
                        )
                      }
                      disabled={
                        status ===
                        "Accepted"
                      }
                    >
                      {status ===
                      "Accepted"
                        ? "Application Accepted"
                        : "Withdraw Application"}
                    </button>

                  </div>

                </div>

              );
            }
          )}

        </div>

      </div>

    </div>
  );
}

export default Applications;