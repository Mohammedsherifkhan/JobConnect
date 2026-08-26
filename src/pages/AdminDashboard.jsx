import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import "../Dashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  /* =====================================================
     STATES
  ===================================================== */

  const [admin, setAdmin] = useState(null);

  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // User filters
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");

  // Job filters
  const [jobSearch, setJobSearch] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");

  // Application filters
  const [applicationSearch, setApplicationSearch] =
    useState("");

  const [applicationStatusFilter, setApplicationStatusFilter] =
    useState("all");

  /* =====================================================
     MODAL STATE
  ===================================================== */

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: "Delete",
    type: "danger",
    onConfirm: null,
  });

  /* =====================================================
     TOAST STATE
  ===================================================== */

  const [toast, setToast] = useState({
    visible: false,
    type: "success",
    message: "",
  });

  /* =====================================================
     SAFE ARRAY PARSER
  ===================================================== */

  const readArrayFromStorage = (key) => {
    try {
      const value = localStorage.getItem(key);

      if (!value) {
        return [];
      }

      const parsed = JSON.parse(value);

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error(`Error reading ${key}:`, error);

      return [];
    }
  };

  /* =====================================================
     TOAST HELPER
  ===================================================== */

  const showToast = useCallback(
    (message, type = "success") => {
      setToast({
        visible: true,
        type,
        message,
      });

      window.setTimeout(() => {
        setToast((current) => ({
          ...current,
          visible: false,
        }));
      }, 3000);
    },
    []
  );

  /* =====================================================
     CLOSE MODAL
  ===================================================== */

  const closeConfirmModal = () => {
    setConfirmModal({
      open: false,
      title: "",
      message: "",
      confirmText: "Delete",
      type: "danger",
      onConfirm: null,
    });
  };

  /* =====================================================
     OPEN CONFIRMATION MODAL
  ===================================================== */

  const openConfirmModal = ({
    title,
    message,
    confirmText = "Delete",
    type = "danger",
    onConfirm,
  }) => {
    setConfirmModal({
      open: true,
      title,
      message,
      confirmText,
      type,
      onConfirm,
    });
  };

  /* =====================================================
     LOAD ADMIN DATA
  ===================================================== */

  const loadAdminData = useCallback(() => {
    const savedUser = localStorage.getItem(
      "jobconnect_current_user"
    );

    if (!savedUser) {
      setAdmin(null);
      navigate("/admin-login");
      return;
    }

    let currentUser;

    try {
      currentUser = JSON.parse(savedUser);
    } catch (error) {
      console.error("Invalid admin data:", error);

      localStorage.removeItem(
        "jobconnect_current_user"
      );

      setAdmin(null);

      navigate("/admin-login");
      return;
    }

    /* ---------------------------------------------
       ADMIN ACCESS PROTECTION
    --------------------------------------------- */

    if (!currentUser || currentUser.role !== "admin") {
      setAdmin(null);
      navigate("/");
      return;
    }

    setAdmin(currentUser);

    /* ---------------------------------------------
       LOAD DATA
    --------------------------------------------- */

    const savedUsers =
      readArrayFromStorage("jobconnect_users");

    const savedJobs =
      readArrayFromStorage("jobconnect_jobs");

    const savedApplications =
      readArrayFromStorage(
        "jobconnect_applications"
      );

    setUsers(savedUsers);
    setJobs(savedJobs);
    setApplications(savedApplications);

    setLastUpdated(new Date());
  }, [navigate]);

  /* =====================================================
     INITIAL LOAD + EVENTS
  ===================================================== */

  useEffect(() => {
    loadAdminData();

    const events = [
      "userLogin",
      "userLogout",
      "userRegistered",
      "userDeleted",
      "jobPosted",
      "jobDeleted",
      "jobUpdated",
      "applicationsUpdated",
    ];

    events.forEach((eventName) => {
      window.addEventListener(
        eventName,
        loadAdminData
      );
    });

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(
          eventName,
          loadAdminData
        );
      });
    };
  }, [loadAdminData]);

  /* =====================================================
     ESC KEY FOR MODAL
  ===================================================== */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeConfirmModal();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  /* =====================================================
     MANUAL REFRESH
  ===================================================== */

  const handleRefresh = () => {
    if (refreshing) {
      return;
    }

    setRefreshing(true);

    loadAdminData();

    window.setTimeout(() => {
      setRefreshing(false);

      showToast(
        "Dashboard data refreshed successfully.",
        "success"
      );
    }, 500);
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

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

  /* =====================================================
     DELETE USER
  ===================================================== */

  const deleteUser = (userId) => {
    const userToDelete = users.find(
      (user) =>
        String(user.id) === String(userId)
    );

    if (!userToDelete) {
      showToast(
        "User not found.",
        "error"
      );

      return;
    }

    /* ---------------------------------------------
       PROTECT ADMIN
    --------------------------------------------- */

    if (userToDelete.role === "admin") {
      showToast(
        "Admin accounts cannot be deleted.",
        "error"
      );

      return;
    }

    const recruiterJobs = jobs.filter(
      (job) =>
        String(job.recruiterId) ===
          String(userId) ||
        String(job.userId) ===
          String(userId)
    );

    const recruiterJobIds =
      recruiterJobs.map((job) =>
        String(job.id)
      );

    const relatedApplications =
      applications.filter(
        (application) => {
          const belongsToCandidate =
            String(
              application.userId
            ) === String(userId) ||
            String(
              application.candidateId
            ) === String(userId);

          const belongsToRecruiterJob =
            recruiterJobIds.includes(
              String(application.jobId)
            );

          return (
            belongsToCandidate ||
            belongsToRecruiterJob
          );
        }
      );

    openConfirmModal({
      title: "Delete User?",
      message:
        `You are about to permanently delete ${
          userToDelete.name ||
          "this user"
        }.\n\n` +
        `${recruiterJobs.length} related job(s) and ` +
        `${relatedApplications.length} related application(s) ` +
        `will also be removed.`,

      confirmText: "Delete User",

      type: "danger",

      onConfirm: () => {
        /* -----------------------------------------
           REMOVE USER
        ----------------------------------------- */

        const updatedUsers = users.filter(
          (user) =>
            String(user.id) !==
            String(userId)
        );

        /* -----------------------------------------
           REMOVE JOBS
        ----------------------------------------- */

        const updatedJobs = jobs.filter(
          (job) =>
            !recruiterJobIds.includes(
              String(job.id)
            )
        );

        /* -----------------------------------------
           REMOVE APPLICATIONS
        ----------------------------------------- */

        const updatedApplications =
          applications.filter(
            (application) => {
              const belongsToCandidate =
                String(
                  application.userId
                ) === String(userId) ||
                String(
                  application.candidateId
                ) === String(userId);

              const belongsToRecruiterJob =
                recruiterJobIds.includes(
                  String(application.jobId)
                );

              return (
                !belongsToCandidate &&
                !belongsToRecruiterJob
              );
            }
          );

        /* -----------------------------------------
           SAVE
        ----------------------------------------- */

        localStorage.setItem(
          "jobconnect_users",
          JSON.stringify(updatedUsers)
        );

        localStorage.setItem(
          "jobconnect_jobs",
          JSON.stringify(updatedJobs)
        );

        localStorage.setItem(
          "jobconnect_applications",
          JSON.stringify(
            updatedApplications
          )
        );

        /* -----------------------------------------
           STATE
        ----------------------------------------- */

        setUsers(updatedUsers);
        setJobs(updatedJobs);
        setApplications(
          updatedApplications
        );

        /* -----------------------------------------
           EVENTS
        ----------------------------------------- */

        window.dispatchEvent(
          new Event("userDeleted")
        );

        window.dispatchEvent(
          new Event("jobDeleted")
        );

        window.dispatchEvent(
          new Event("applicationsUpdated")
        );

        setLastUpdated(new Date());

        showToast(
          `${
            userToDelete.name ||
            "User"
          } deleted successfully.`,
          "success"
        );

        closeConfirmModal();
      },
    });
  };

  /* =====================================================
     DELETE JOB
  ===================================================== */

  const deleteJob = (jobId) => {
    const jobToDelete = jobs.find(
      (job) =>
        String(job.id) ===
        String(jobId)
    );

    if (!jobToDelete) {
      showToast(
        "Job not found.",
        "error"
      );

      return;
    }

    const relatedApplications =
      applications.filter(
        (application) =>
          String(
            application.jobId
          ) === String(jobId)
      );

    openConfirmModal({
      title: "Delete Job?",
      message:
        `You are about to permanently delete "${
          jobToDelete.title ||
          "this job"
        }".\n\n` +
        `${relatedApplications.length} related application(s) ` +
        `will also be deleted.`,

      confirmText: "Delete Job",

      type: "danger",

      onConfirm: () => {
        /* -----------------------------------------
           REMOVE JOB
        ----------------------------------------- */

        const updatedJobs = jobs.filter(
          (job) =>
            String(job.id) !==
            String(jobId)
        );

        /* -----------------------------------------
           REMOVE APPLICATIONS
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
          JSON.stringify(updatedJobs)
        );

        localStorage.setItem(
          "jobconnect_applications",
          JSON.stringify(
            updatedApplications
          )
        );

        /* -----------------------------------------
           STATE
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
          new Event("applicationsUpdated")
        );

        setLastUpdated(new Date());

        showToast(
          "Job and related applications deleted successfully.",
          "success"
        );

        closeConfirmModal();
      },
    });
  };

  /* =====================================================
     DELETE APPLICATION
  ===================================================== */

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
      showToast(
        "Application not found.",
        "error"
      );

      return;
    }

    openConfirmModal({
      title: "Delete Application?",
      message:
        "This application will be permanently removed from JobConnect.",

      confirmText:
        "Delete Application",

      type: "danger",

      onConfirm: () => {
        const updatedApplications =
          applications.filter(
            (item) =>
              String(item.id) !==
              String(applicationId)
          );

        localStorage.setItem(
          "jobconnect_applications",
          JSON.stringify(
            updatedApplications
          )
        );

        setApplications(
          updatedApplications
        );

        window.dispatchEvent(
          new Event(
            "applicationsUpdated"
          )
        );

        setLastUpdated(new Date());

        showToast(
          "Application deleted successfully.",
          "success"
        );

        closeConfirmModal();
      },
    });
  };

  /* =====================================================
     UPDATE APPLICATION STATUS
  ===================================================== */

  const updateApplicationStatus = (
    applicationId,
    newStatus
  ) => {
    const exists =
      applications.some(
        (application) =>
          String(application.id) ===
          String(applicationId)
      );

    if (!exists) {
      showToast(
        "Application not found.",
        "error"
      );

      return;
    }

    const updatedApplications =
      applications.map(
        (application) => {
          if (
            String(application.id) !==
            String(applicationId)
          ) {
            return application;
          }

          return {
            ...application,
            status: newStatus,
          };
        }
      );

    localStorage.setItem(
      "jobconnect_applications",
      JSON.stringify(
        updatedApplications
      )
    );

    setApplications(
      updatedApplications
    );

    window.dispatchEvent(
      new Event(
        "applicationsUpdated"
      )
    );

    setLastUpdated(new Date());

    showToast(
      `Application status updated to ${newStatus}.`,
      "success"
    );
  };

  /* =====================================================
     USER COUNTS
  ===================================================== */

  const candidateCount =
    users.filter(
      (user) =>
        user.role === "candidate"
    ).length;

  const recruiterCount =
    users.filter(
      (user) =>
        user.role === "recruiter"
    ).length;

  const adminCount =
    users.filter(
      (user) =>
        user.role === "admin"
    ).length;

  /* =====================================================
     USER FILTERS
  ===================================================== */

  const filteredUsers = useMemo(() => {
    const search =
      userSearch
        .toLowerCase()
        .trim();

    return users.filter((user) => {
      const userName =
        (user.name || "").toLowerCase();

      const userEmail =
        (user.email || "").toLowerCase();

      const matchesSearch =
        !search ||
        userName.includes(search) ||
        userEmail.includes(search);

      const matchesRole =
        userRoleFilter === "all" ||
        user.role === userRoleFilter;

      return (
        matchesSearch &&
        matchesRole
      );
    });
  }, [
    users,
    userSearch,
    userRoleFilter,
  ]);

  /* =====================================================
     JOB TYPES
  ===================================================== */

  const jobTypes = useMemo(() => {
    const types = jobs
      .map((job) =>
        String(job.type || "")
          .trim()
      )
      .filter(Boolean);

    return [...new Set(types)];
  }, [jobs]);

  /* =====================================================
     FILTER JOBS
  ===================================================== */

  const filteredJobs = useMemo(() => {
    const search =
      jobSearch
        .toLowerCase()
        .trim();

    return jobs.filter((job) => {
      const title =
        (job.title || "").toLowerCase();

      const company =
        (job.company || "").toLowerCase();

      const location =
        (job.location || "").toLowerCase();

      const type =
        (job.type || "").toLowerCase();

      const matchesSearch =
        !search ||
        title.includes(search) ||
        company.includes(search) ||
        location.includes(search) ||
        type.includes(search);

      const matchesType =
        jobTypeFilter === "all" ||
        job.type === jobTypeFilter;

      return (
        matchesSearch &&
        matchesType
      );
    });
  }, [
    jobs,
    jobSearch,
    jobTypeFilter,
  ]);

  /* =====================================================
     APPLICATION COUNTS
  ===================================================== */

  const pendingCount =
    applications.filter(
      (application) => {
        const status =
          application.status ||
          "Applied";

        return (
          status === "Applied" ||
          status === "Pending"
        );
      }
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

  /* =====================================================
     APPLICATION FILTERS
  ===================================================== */

  const filteredApplications =
    useMemo(() => {
      const search =
        applicationSearch
          .toLowerCase()
          .trim();

      return applications.filter(
        (application) => {
          const currentStatus =
            application.status ||
            "Applied";

          const candidateName =
            (
              application.candidateName ||
              ""
            ).toLowerCase();

          const candidateEmail =
            (
              application.candidateEmail ||
              application.userEmail ||
              ""
            ).toLowerCase();

          const jobTitle =
            (
              application.title ||
              ""
            ).toLowerCase();

          const company =
            (
              application.company ||
              ""
            ).toLowerCase();

          const matchesSearch =
            !search ||
            candidateName.includes(
              search
            ) ||
            candidateEmail.includes(
              search
            ) ||
            jobTitle.includes(
              search
            ) ||
            company.includes(search);

          const matchesStatus =
            applicationStatusFilter ===
              "all" ||
            currentStatus ===
              applicationStatusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      applications,
      applicationSearch,
      applicationStatusFilter,
    ]);

  /* =====================================================
     RECENT APPLICATIONS
  ===================================================== */

  const recentApplications =
    useMemo(() => {
      return [...applications]
        .slice(-5)
        .reverse();
    }, [applications]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (!admin) {
    return null;
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="dashboard-page">

      {/* =================================================
          TOAST
      ================================================= */}

      {toast.visible && (
        <div
          className={`admin-toast ${
            toast.type === "error"
              ? "admin-toast-error"
              : "admin-toast-success"
          }`}
        >
          <span className="admin-toast-icon">
            {toast.type === "error"
              ? "⚠️"
              : "✅"}
          </span>

          <span>
            {toast.message}
          </span>

          <button
            type="button"
            onClick={() =>
              setToast((current) => ({
                ...current,
                visible: false,
              }))
            }
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}

      <div className="dashboard-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="dashboard-header">

          <div>

            <span className="dashboard-label">
              ADMIN DASHBOARD
            </span>

            <h1>
              Welcome,{" "}
              {admin.name || "Admin"} 👋
            </h1>

            <p>
              Manage users, jobs and
              applications from one place.
            </p>

            {lastUpdated && (
              <small
                style={{
                  opacity: 0.65,
                  display: "block",
                  marginTop: "8px",
                }}
              >
                Last updated:{" "}
                {lastUpdated.toLocaleTimeString()}
              </small>
            )}

          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >

            <button
              type="button"
              className="dashboard-post-btn"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing
                ? "⏳ Refreshing..."
                : "🔄 Refresh"}
            </button>

            <button
              type="button"
              className="dashboard-post-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </div>

        {/* =================================================
            MAIN STATISTICS
        ================================================= */}

        <div className="dashboard-stats">

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

        {/* =================================================
            PLATFORM OVERVIEW
        ================================================= */}

        <div className="dashboard-section">

          <div className="section-title">

            <h2>
              Platform Overview
            </h2>

            <p>
              Current JobConnect platform
              activity.
            </p>

          </div>

          <div className="dashboard-stats">

            <div className="stat-card">
              <div className="stat-icon">
                🛡️
              </div>

              <div>
                <span>
                  Admins
                </span>

                <strong>
                  {adminCount}
                </strong>
              </div>
            </div>

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

        </div>

        {/* =================================================
            USERS
        ================================================= */}

        <div className="dashboard-section">

          <div className="section-title">

            <h2>
              Registered Users
            </h2>

            <p>
              Search and manage users
              registered on JobConnect.
            </p>

          </div>

          <div className="admin-filters">

            <input
              type="text"
              placeholder="🔎 Search users by name or email..."
              value={userSearch}
              onChange={(event) =>
                setUserSearch(
                  event.target.value
                )
              }
            />

            <select
              value={userRoleFilter}
              onChange={(event) =>
                setUserRoleFilter(
                  event.target.value
                )
              }
            >
              <option value="all">
                All Users
              </option>

              <option value="candidate">
                Candidates
              </option>

              <option value="recruiter">
                Recruiters
              </option>

              <option value="admin">
                Admins
              </option>
            </select>

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
                Registered users will
                appear here.
              </p>
            </div>

          ) : filteredUsers.length === 0 ? (

            <div className="empty-dashboard">
              <div className="empty-icon">
                🔎
              </div>

              <h3>
                No matching users
              </h3>

              <p>
                Try changing your
                search or role filter.
              </p>
            </div>

          ) : (

            <div className="recruiter-applications">

              {filteredUsers.map(
                (user) => (

                  <div
                    className="recruiter-application-card"
                    key={user.id}
                  >

                    <div className="candidate-avatar">
                      {user.name
                        ? user.name
                            .charAt(0)
                            .toUpperCase()
                        : "U"}
                    </div>

                    <div className="candidate-content">

                      <div className="candidate-header">

                        <div>

                          <h3>
                            {user.name ||
                              "Unknown User"}
                          </h3>

                          <p>
                            📧{" "}
                            {user.email ||
                              "No email"}
                          </p>

                        </div>

                        <span
                          className={`application-status ${
                            user.role ===
                            "admin"
                              ? "accepted"
                              : user.role ===
                                "recruiter"
                              ? "pending"
                              : "applied"
                          }`}
                        >
                          {user.role ===
                          "admin"
                            ? "Admin"
                            : user.role ===
                              "recruiter"
                            ? "Recruiter"
                            : "Candidate"}
                        </span>

                      </div>

                      <div className="application-actions">

                        {user.role === "admin" ? (

                          <span
                            style={{
                              opacity: 0.65,
                              fontSize:
                                "14px",
                            }}
                          >
                            🛡️ Protected account
                          </span>

                        ) : (

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

                        )}

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

        {/* =================================================
            JOBS
        ================================================= */}

        <div className="dashboard-section">

          <div className="section-title">

            <h2>
              Posted Jobs
            </h2>

            <p>
              Search and manage jobs
              posted by recruiters.
            </p>

          </div>

          <div className="admin-filters">

            <input
              type="text"
              placeholder="🔎 Search job, company or location..."
              value={jobSearch}
              onChange={(event) =>
                setJobSearch(
                  event.target.value
                )
              }
            />

            <select
              value={jobTypeFilter}
              onChange={(event) =>
                setJobTypeFilter(
                  event.target.value
                )
              }
            >

              <option value="all">
                All Job Types
              </option>

              {jobTypes.map(
                (type) => (
                  <option
                    value={type}
                    key={type}
                  >
                    {type}
                  </option>
                )
              )}

            </select>

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

          ) : filteredJobs.length === 0 ? (

            <div className="empty-dashboard">

              <div className="empty-icon">
                🔎
              </div>

              <h3>
                No matching jobs
              </h3>

              <p>
                Try changing your
                search or job type filter.
              </p>

            </div>

          ) : (

            <div className="recruiter-jobs">

              {filteredJobs.map(
                (job) => {

                  const jobApplicationCount =
                    applications.filter(
                      (application) =>
                        String(
                          application.jobId
                        ) ===
                        String(job.id)
                    ).length;

                  const recruiter =
                    users.find(
                      (user) =>
                        String(
                          user.id
                        ) ===
                        String(
                          job.recruiterId ||
                            job.userId
                        )
                    );

                  return (

                    <div
                      className="recruiter-job-card"
                      key={job.id}
                    >

                      <div className="recruiter-job-info">

                        <span className="job-type-badge">
                          {job.type ||
                            "Job"}
                        </span>

                        <h3>
                          {job.title ||
                            "Untitled Job"}
                        </h3>

                        <p>
                          🏢{" "}
                          {job.company ||
                            "Company"}
                        </p>

                        {recruiter && (
                          <p>
                            👤 Recruiter:{" "}
                            {recruiter.name ||
                              "Unknown"}
                          </p>
                        )}

                        <div className="job-meta">

                          <span>
                            📍{" "}
                            {job.location ||
                              "Not specified"}
                          </span>

                          <span>
                            🎓{" "}
                            {job.experience ||
                              "Not specified"}
                          </span>

                          <span>
                            💰{" "}
                            {job.salary ||
                              "Not specified"}
                          </span>

                        </div>

                      </div>

                      <div className="job-application-info">

                        <strong>
                          {jobApplicationCount}
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

        {/* =================================================
            APPLICATIONS
        ================================================= */}

        <div className="dashboard-section">

          <div className="section-title">

            <h2>
              All Applications
            </h2>

            <p>
              Review and manage
              applications submitted
              by candidates.
            </p>

          </div>

          <div className="dashboard-stats">

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

          <div className="admin-filters">

            <input
              type="text"
              placeholder="🔎 Search candidate, email, job or company..."
              value={applicationSearch}
              onChange={(event) =>
                setApplicationSearch(
                  event.target.value
                )
              }
            />

            <select
              value={
                applicationStatusFilter
              }
              onChange={(event) =>
                setApplicationStatusFilter(
                  event.target.value
                )
              }
            >

              <option value="all">
                All Applications
              </option>

              <option value="Applied">
                Applied
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Accepted">
                Accepted
              </option>

              <option value="Rejected">
                Rejected
              </option>

            </select>

          </div>

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

          ) : filteredApplications.length === 0 ? (

            <div className="empty-dashboard">

              <div className="empty-icon">
                🔎
              </div>

              <h3>
                No matching applications
              </h3>

              <p>
                Try changing your
                search or status filter.
              </p>

            </div>

          ) : (

            <div className="recruiter-applications">

              {filteredApplications.map(
                (application) => {

                  const currentStatus =
                    application.status ||
                    "Applied";

                  const statusClass =
                    currentStatus
                      .toLowerCase()
                      .replace(
                        /\s+/g,
                        "-"
                      );

                  return (

                    <div
                      className="recruiter-application-card"
                      key={application.id}
                    >

                      <div className="candidate-avatar">

                        {application.candidateName
                          ? application.candidateName
                              .charAt(0)
                              .toUpperCase()
                          : "U"}

                      </div>

                      <div className="candidate-content">

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

                          <span
                            className={`application-status ${statusClass}`}
                          >
                            {currentStatus}
                          </span>

                        </div>

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

                        <div className="application-actions">

                          <select
                            value={
                              currentStatus
                            }
                            onChange={(event) =>
                              updateApplicationStatus(
                                application.id,
                                event.target.value
                              )
                            }
                          >

                            <option value="Applied">
                              Applied
                            </option>

                            <option value="Pending">
                              Pending
                            </option>

                            <option value="Accepted">
                              Accepted
                            </option>

                            <option value="Rejected">
                              Rejected
                            </option>

                          </select>

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

                  );
                }
              )}

            </div>

          )}

        </div>

        {/* =================================================
            RECENT APPLICATIONS
        ================================================= */}

        <div className="dashboard-section">

          <div className="section-title">

            <h2>
              Recent Applications
            </h2>

            <p>
              Latest candidate application
              activity.
            </p>

          </div>

          {recentApplications.length === 0 ? (

            <div className="empty-dashboard">

              <div className="empty-icon">
                📊
              </div>

              <h3>
                No recent activity
              </h3>

              <p>
                Application activity will
                appear here.
              </p>

            </div>

          ) : (

            <div className="recruiter-applications">

              {recentApplications.map(
                (application) => {

                  const status =
                    application.status ||
                    "Applied";

                  const statusClass =
                    status
                      .toLowerCase()
                      .replace(
                        /\s+/g,
                        "-"
                      );

                  return (

                    <div
                      className="recruiter-application-card"
                      key={`recent-${application.id}`}
                    >

                      <div className="candidate-avatar">

                        {application.candidateName
                          ? application.candidateName
                              .charAt(0)
                              .toUpperCase()
                          : "U"}

                      </div>

                      <div className="candidate-content">

                        <div className="candidate-header">

                          <div>

                            <h3>
                              {
                                application.candidateName ||
                                "Candidate"
                              }
                            </h3>

                            <p>
                              Applied for{" "}
                              {
                                application.title ||
                                "a job"
                              }
                            </p>

                          </div>

                          <span
                            className={`application-status ${statusClass}`}
                          >
                            {status}
                          </span>

                        </div>

                        <div className="candidate-details">

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

                      </div>

                    </div>

                  );
                }
              )}

            </div>

          )}

        </div>

      </div>

      {/* =================================================
          CONFIRMATION MODAL
      ================================================= */}

      {confirmModal.open && (
        <div
          className="admin-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeConfirmModal();
            }
          }}
        >

          <div
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-modal-title"
          >

            <button
              type="button"
              className="admin-modal-close"
              onClick={closeConfirmModal}
              aria-label="Close modal"
            >
              ×
            </button>

            <div
              className={`admin-modal-icon ${
                confirmModal.type ===
                "danger"
                  ? "admin-modal-danger"
                  : "admin-modal-warning"
              }`}
            >
              {confirmModal.type ===
              "danger"
                ? "🗑️"
                : "⚠️"}
            </div>

            <h2 id="admin-modal-title">
              {confirmModal.title}
            </h2>

            <p>
              {confirmModal.message}
            </p>

            <div className="admin-modal-actions">

              <button
                type="button"
                className="admin-modal-cancel"
                onClick={
                  closeConfirmModal
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className={
                  confirmModal.type ===
                  "danger"
                    ? "admin-modal-confirm danger"
                    : "admin-modal-confirm"
                }
                onClick={() => {
                  if (
                    typeof confirmModal.onConfirm ===
                    "function"
                  ) {
                    confirmModal.onConfirm();
                  }
                }}
              >
                {confirmModal.confirmText}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminDashboard;