import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../Dashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  /* =========================================
     LOAD ADMIN DATA
  ========================================= */

  const loadAdminData = () => {
    const savedUser = localStorage.getItem(
      "jobconnect_current_user"
    );

    /* -----------------------------------------
       CHECK ADMIN LOGIN
    ----------------------------------------- */

    if (!savedUser) {
      navigate("/admin-login");
      return;
    }

    let currentUser;

    try {
      currentUser = JSON.parse(savedUser);
    } catch (error) {
      console.error(
        "Invalid admin data:",
        error
      );

      navigate("/admin-login");
      return;
    }

    /* -----------------------------------------
       CHECK ADMIN ROLE
    ----------------------------------------- */

    if (currentUser.role !== "admin") {
      navigate("/");
      return;
    }

    setAdmin(currentUser);

    /* -----------------------------------------
       LOAD USERS
    ----------------------------------------- */

    const savedUsers =
      JSON.parse(
        localStorage.getItem(
          "jobconnect_users"
        )
      ) || [];

    /* -----------------------------------------
       LOAD JOBS
    ----------------------------------------- */

    const savedJobs =
      JSON.parse(
        localStorage.getItem(
          "jobconnect_jobs"
        )
      ) || [];

    /* -----------------------------------------
       LOAD APPLICATIONS
    ----------------------------------------- */

    const savedApplications =
      JSON.parse(
        localStorage.getItem(
          "jobconnect_applications"
        )
      ) || [];

    setUsers(savedUsers);
    setJobs(savedJobs);
    setApplications(savedApplications);
  };

  /* =========================================
     EFFECT
  ========================================= */

  useEffect(() => {
    loadAdminData();

    window.addEventListener(
      "userLogin",
      loadAdminData
    );

    window.addEventListener(
      "userLogout",
      loadAdminData
    );

    window.addEventListener(
      "userDeleted",
      loadAdminData
    );

    window.addEventListener(
      "jobPosted",
      loadAdminData
    );

    window.addEventListener(
      "jobDeleted",
      loadAdminData
    );

    window.addEventListener(
      "applicationsUpdated",
      loadAdminData
    );

    return () => {
      window.removeEventListener(
        "userLogin",
        loadAdminData
      );

      window.removeEventListener(
        "userLogout",
        loadAdminData
      );

      window.removeEventListener(
        "userDeleted",
        loadAdminData
      );

      window.removeEventListener(
        "jobPosted",
        loadAdminData
      );

      window.removeEventListener(
        "jobDeleted",
        loadAdminData
      );

      window.removeEventListener(
        "applicationsUpdated",
        loadAdminData
      );
    };
  }, []);

  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = () => {
    localStorage.removeItem(
      "jobconnect_current_user"
    );

    setAdmin(null);

    window.dispatchEvent(
      new Event("userLogout")
    );

    navigate("/");
  };

  /* =========================================
     DELETE USER
  ========================================= */

  const deleteUser = (userId) => {
    const userToDelete = users.find(
      (user) =>
        String(user.id) ===
        String(userId)
    );

    if (!userToDelete) {
      alert("User not found.");
      return;
    }

    const confirmDelete =
      window.confirm(
        `Delete ${
          userToDelete.name ||
          "this user"
        }?\n\n` +
        `This will also remove their related data.`
      );

    if (!confirmDelete) {
      return;
    }

    /* -----------------------------------------
       DELETE USER
    ----------------------------------------- */

    const updatedUsers =
      users.filter(
        (user) =>
          String(user.id) !==
          String(userId)
      );

    /* -----------------------------------------
       FIND RECRUITER JOBS
    ----------------------------------------- */

    const recruiterJobs =
      jobs.filter(
        (job) =>
          String(job.recruiterId) ===
            String(userId) ||
          String(job.userId) ===
            String(userId)
      );

    const recruiterJobIds =
      recruiterJobs.map(
        (job) =>
          String(job.id)
      );

    /* -----------------------------------------
       DELETE RECRUITER JOBS
    ----------------------------------------- */

    const updatedJobs =
      jobs.filter(
        (job) =>
          !recruiterJobIds.includes(
            String(job.id)
          )
      );

    /* -----------------------------------------
       DELETE RELATED APPLICATIONS
    ----------------------------------------- */

    const updatedApplications =
      applications.filter(
        (application) => {

          /* Candidate applications */

          if (
            String(
              application.userId
            ) === String(userId)
          ) {
            return false;
          }

          if (
            String(
              application.candidateId
            ) === String(userId)
          ) {
            return false;
          }

          /* Recruiter's job applications */

          if (
            recruiterJobIds.includes(
              String(
                application.jobId
              )
            )
          ) {
            return false;
          }

          return true;
        }
      );

    /* -----------------------------------------
       SAVE USERS
    ----------------------------------------- */

    localStorage.setItem(
      "jobconnect_users",
      JSON.stringify(
        updatedUsers
      )
    );

    /* -----------------------------------------
       SAVE JOBS
    ----------------------------------------- */

    localStorage.setItem(
      "jobconnect_jobs",
      JSON.stringify(
        updatedJobs
      )
    );

    /* -----------------------------------------
       SAVE APPLICATIONS
    ----------------------------------------- */

    localStorage.setItem(
      "jobconnect_applications",
      JSON.stringify(
        updatedApplications
      )
    );

    /* -----------------------------------------
       UPDATE STATE
    ----------------------------------------- */

    setUsers(updatedUsers);
    setJobs(updatedJobs);
    setApplications(
      updatedApplications
    );

    /* -----------------------------------------
       UPDATE OTHER COMPONENTS
    ----------------------------------------- */

    window.dispatchEvent(
      new Event("userDeleted")
    );

    window.dispatchEvent(
      new Event("jobDeleted")
    );

    window.dispatchEvent(
      new Event(
        "applicationsUpdated"
      )
    );

    alert(
      `${
        userToDelete.name ||
        "User"
      } deleted successfully.`
    );
  };

  /* =========================================
     DELETE JOB
  ========================================= */

  const deleteJob = (jobId) => {
    const jobToDelete =
      jobs.find(
        (job) =>
          String(job.id) ===
          String(jobId)
      );

    if (!jobToDelete) {
      alert("Job not found.");
      return;
    }

    const relatedApplications =
      applications.filter(
        (application) =>
          String(
            application.jobId
          ) === String(jobId)
      );

    const confirmDelete =
      window.confirm(
        `Delete "${jobToDelete.title}"?\n\n` +
        `${relatedApplications.length} related application(s) will also be deleted.`
      );

    if (!confirmDelete) {
      return;
    }

    /* -----------------------------------------
       DELETE JOB
    ----------------------------------------- */

    const updatedJobs =
      jobs.filter(
        (job) =>
          String(job.id) !==
          String(jobId)
      );

    /* -----------------------------------------
       DELETE APPLICATIONS
    ----------------------------------------- */

    const updatedApplications =
      applications.filter(
        (application) =>
          String(
            application.jobId
          ) !== String(jobId)
      );

    /* -----------------------------------------
       SAVE
    ----------------------------------------- */

    localStorage.setItem(
      "jobconnect_jobs",
      JSON.stringify(
        updatedJobs
      )
    );

    localStorage.setItem(
      "jobconnect_applications",
      JSON.stringify(
        updatedApplications
      )
    );

    /* -----------------------------------------
       UPDATE STATE
    ----------------------------------------- */

    setJobs(updatedJobs);
    setApplications(
      updatedApplications
    );

    /* -----------------------------------------
       EVENTS
    ----------------------------------------- */

    window.dispatchEvent(
      new Event("jobDeleted")
    );

    window.dispatchEvent(
      new Event(
        "applicationsUpdated"
      )
    );

    alert(
      "Job and related applications deleted successfully."
    );
  };

  /* =========================================
     DELETE APPLICATION
  ========================================= */

  const deleteApplication = (
    applicationId
  ) => {
    const application =
      applications.find(
        (item) =>
          String(item.id) ===
          String(applicationId)
      );

    if (!application) {
      alert(
        "Application not found."
      );
      return;
    }

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this application?"
      );

    if (!confirmDelete) {
      return;
    }

    /* -----------------------------------------
       DELETE APPLICATION
    ----------------------------------------- */

    const updatedApplications =
      applications.filter(
        (item) =>
          String(item.id) !==
          String(applicationId)
      );

    /* -----------------------------------------
       SAVE
    ----------------------------------------- */

    localStorage.setItem(
      "jobconnect_applications",
      JSON.stringify(
        updatedApplications
      )
    );

    /* -----------------------------------------
       UPDATE STATE
    ----------------------------------------- */

    setApplications(
      updatedApplications
    );

    /* -----------------------------------------
       EVENT
    ----------------------------------------- */

    window.dispatchEvent(
      new Event(
        "applicationsUpdated"
      )
    );

    alert(
      "Application deleted successfully."
    );
  };

  /* =========================================
     USER COUNTS
  ========================================= */

  const candidateCount =
    users.filter(
      (user) =>
        user.role ===
        "candidate"
    ).length;

  const recruiterCount =
    users.filter(
      (user) =>
        user.role ===
        "recruiter"
    ).length;

  /* =========================================
     APPLICATION COUNTS
  ========================================= */

  const pendingCount =
    applications.filter(
      (application) =>
        !application.status ||
        application.status ===
          "Applied" ||
        application.status ===
          "Pending"
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
     LOADING
  ========================================= */

  if (!admin) {
    return null;
  }

  /* =========================================
     ADMIN DASHBOARD
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
              ADMIN DASHBOARD
            </span>

            <h1>
              Welcome,{" "}
              {admin.name} 👋
            </h1>

            <p>
              Manage users, jobs and
              applications.
            </p>

          </div>

          <button
            type="button"
            className="dashboard-post-btn"
            onClick={
              handleLogout
            }
          >
            Logout
          </button>

        </div>


        {/* =====================================
            MAIN STATISTICS
        ===================================== */}

        <div className="dashboard-stats">

          {/* TOTAL USERS */}

          <div className="stat-card">

            <div className="stat-icon">
              👥
            </div>

            <div>

              <span>
                Total Users
              </span>

              <strong>
                {users.length}
              </strong>

            </div>

          </div>


          {/* CANDIDATES */}

          <div className="stat-card">

            <div className="stat-icon">
              👤
            </div>

            <div>

              <span>
                Candidates
              </span>

              <strong>
                {candidateCount}
              </strong>

            </div>

          </div>


          {/* RECRUITERS */}

          <div className="stat-card">

            <div className="stat-icon">
              💼
            </div>

            <div>

              <span>
                Recruiters
              </span>

              <strong>
                {recruiterCount}
              </strong>

            </div>

          </div>


          {/* JOBS */}

          <div className="stat-card">

            <div className="stat-icon">
              📋
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

        </div>


        {/* =====================================
            USERS
        ===================================== */}

        <div className="dashboard-section">

          <div className="section-title">

            <h2>
              Registered Users
            </h2>

            <p>
              Users registered on
              JobConnect.
            </p>

          </div>


          {users.length === 0 ? (

            <div className="empty-dashboard">

              <div className="empty-icon">
                👥
              </div>

              <h3>
                No users found
              </h3>

              <p>
                Registered users
                will appear here.
              </p>

            </div>

          ) : (

            <div className="recruiter-applications">

              {users.map(
                (user) => (

                  <div
                    className="recruiter-application-card"
                    key={user.id}
                  >

                    {/* AVATAR */}

                    <div className="candidate-avatar">

                      {user.name
                        ? user.name
                            .charAt(0)
                            .toUpperCase()
                        : "U"}

                    </div>


                    <div className="candidate-content">

                      {/* USER HEADER */}

                      <div className="candidate-header">

                        <div>

                          <h3>
                            {
                              user.name ||
                              "Unknown User"
                            }
                          </h3>

                          <p>
                            📧{" "}
                            {
                              user.email ||
                              "No email"
                            }
                          </p>

                        </div>


                        {/* ROLE */}

                        <span className="application-status">

                          {user.role ===
                          "recruiter"
                            ? "Recruiter"
                            : "Candidate"}

                        </span>

                      </div>


                      {/* DELETE USER */}

                      <div className="application-actions">

                        <button
                          type="button"
                          className="reject-btn"
                          onClick={() =>
                            deleteUser(
                              user.id
                            )
                          }
                        >
                          🗑️ Delete User
                        </button>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>


        {/* =====================================
            JOBS
        ===================================== */}

        <div className="dashboard-section">

          <div className="section-title">

            <h2>
              Posted Jobs
            </h2>

            <p>
              Jobs currently posted
              by recruiters.
            </p>

          </div>


          {jobs.length === 0 ? (

            <div className="empty-dashboard">

              <div className="empty-icon">
                💼
              </div>

              <h3>
                No jobs posted
              </h3>

              <p>
                Recruiter job postings
                will appear here.
              </p>

            </div>

          ) : (

            <div className="recruiter-jobs">

              {jobs.map(
                (job) => {

                  const jobApplicationCount =
                    applications.filter(
                      (application) =>
                        String(
                          application.jobId
                        ) ===
                        String(job.id)
                    ).length;

                  return (

                    <div
                      className="recruiter-job-card"
                      key={job.id}
                    >

                      <div className="recruiter-job-info">

                        <span className="job-type-badge">
                          {
                            job.type ||
                            "Job"
                          }
                        </span>

                        <h3>
                          {
                            job.title ||
                            "Untitled Job"
                          }
                        </h3>

                        <p>
                          {
                            job.company ||
                            "Company"
                          }
                        </p>

                        <div className="job-meta">

                          <span>
                            📍{" "}
                            {
                              job.location ||
                              "Not specified"
                            }
                          </span>

                          <span>
                            🎓{" "}
                            {
                              job.experience ||
                              "Not specified"
                            }
                          </span>

                          <span>
                            💰{" "}
                            {
                              job.salary ||
                              "Not specified"
                            }
                          </span>

                        </div>

                      </div>


                      {/* JOB ACTIONS */}

                      <div className="job-application-info">

                        <strong>
                          {
                            jobApplicationCount
                          }
                        </strong>

                        <span>
                          Applications
                        </span>

                        <button
                          type="button"
                          className="reject-btn"
                          onClick={() =>
                            deleteJob(
                              job.id
                            )
                          }
                        >
                          🗑️ Delete Job
                        </button>

                      </div>

                    </div>

                  );
                }
              )}

            </div>

          )}

        </div>


        {/* =====================================
            APPLICATIONS
        ===================================== */}

        <div className="dashboard-section">

          <div className="section-title">

            <h2>
              All Applications
            </h2>

            <p>
              Review applications
              submitted by candidates.
            </p>

          </div>


          {/* APPLICATION STATISTICS */}

          <div className="dashboard-stats">

            {/* PENDING */}

            <div className="stat-card">

              <div className="stat-icon">
                ⏳
              </div>

              <div>

                <span>
                  Pending
                </span>

                <strong>
                  {pendingCount}
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


          {/* APPLICATION LIST */}

          {applications.length === 0 ? (

            <div className="empty-dashboard">

              <div className="empty-icon">
                📄
              </div>

              <h3>
                No applications found
              </h3>

              <p>
                Candidate applications
                will appear here.
              </p>

            </div>

          ) : (

            <div className="recruiter-applications">

              {applications.map(
                (application) => (

                  <div
                    className="recruiter-application-card"
                    key={
                      application.id
                    }
                  >

                    {/* CANDIDATE AVATAR */}

                    <div className="candidate-avatar">

                      {application.candidateName
                        ? application.candidateName
                            .charAt(0)
                            .toUpperCase()
                        : "U"}

                    </div>


                    <div className="candidate-content">

                      {/* APPLICATION HEADER */}

                      <div className="candidate-header">

                        <div>

                          <h3>
                            {
                              application.candidateName ||
                              "Candidate"
                            }
                          </h3>

                          <p>
                            📧{" "}
                            {
                              application.candidateEmail ||
                              application.userEmail ||
                              "No email"
                            }
                          </p>

                        </div>


                        {/* STATUS */}

                        <span className="application-status">

                          {
                            application.status ||
                            "Applied"
                          }

                        </span>

                      </div>


                      {/* APPLICATION DETAILS */}

                      <div className="candidate-details">

                        <span>
                          💼{" "}
                          {
                            application.title ||
                            "Job"
                          }
                        </span>

                        <span>
                          🏢{" "}
                          {
                            application.company ||
                            "Company"
                          }
                        </span>

                        <span>
                          📅{" "}
                          {
                            application.appliedAt ||
                            "Recently"
                          }
                        </span>

                      </div>


                      {/* DELETE APPLICATION */}

                      <div className="application-actions">

                        <button
                          type="button"
                          className="reject-btn"
                          onClick={() =>
                            deleteApplication(
                              application.id
                            )
                          }
                        >
                          🗑️ Delete Application
                        </button>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;