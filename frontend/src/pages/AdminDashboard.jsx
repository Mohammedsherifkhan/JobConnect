import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../Dashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  /* =====================================================
     STORAGE KEYS
  ===================================================== */

  const STORAGE_KEYS = {
    currentUser: "jobconnect_current_user",
    users: "jobconnect_users",
    jobs: "jobconnect_jobs",
    applications: "jobconnect_applications",
  };

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
  const [applicationSearch, setApplicationSearch] = useState("");
  const [applicationStatusFilter, setApplicationStatusFilter] =
    useState("all");

  /* =====================================================
     SAFE STORAGE HELPERS
  ===================================================== */

  const readArrayFromStorage = useCallback((key) => {
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
  }, []);

  const saveArrayToStorage = useCallback((key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      alert("Unable to save changes. Please try again.");
      return false;
    }
  }, []);

  /* =====================================================
     FORMATTERS
  ===================================================== */

  const formatDate = useCallback((value) => {
    if (!value) {
      return "Recently";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString();
  }, []);

  const normalize = useCallback((value) => {
    return String(value || "")
      .toLowerCase()
      .trim();
  }, []);

  const getStatusClass = useCallback((status) => {
    return String(status || "Applied")
      .toLowerCase()
      .replace(/\s+/g, "-");
  }, []);

  const getUserName = useCallback((user) => {
    return user?.name || "Unknown User";
  }, []);

  const getJobRecruiterId = useCallback((job) => {
    return job?.recruiterId ?? job?.userId ?? null;
  }, []);

  /* =====================================================
     LOAD ADMIN DATA
  ===================================================== */

  const loadAdminData = useCallback(() => {
    const savedUser = localStorage.getItem(
      STORAGE_KEYS.currentUser
    );

    if (!savedUser) {
      setAdmin(null);
      navigate("/admin-login", { replace: true });
      return;
    }

    let currentUser;

    try {
      currentUser = JSON.parse(savedUser);
    } catch (error) {
      console.error("Invalid current user data:", error);

      localStorage.removeItem(STORAGE_KEYS.currentUser);

      setAdmin(null);

      navigate("/admin-login", { replace: true });

      return;
    }

    /* ---------------------------------------------
       ADMIN ACCESS PROTECTION
    --------------------------------------------- */

    if (!currentUser || currentUser.role !== "admin") {
      setAdmin(null);

      navigate("/", { replace: true });

      return;
    }

    setAdmin(currentUser);

    /* ---------------------------------------------
       LOAD PLATFORM DATA
    --------------------------------------------- */

    const savedUsers = readArrayFromStorage(
      STORAGE_KEYS.users
    );

    const savedJobs = readArrayFromStorage(
      STORAGE_KEYS.jobs
    );

    const savedApplications = readArrayFromStorage(
      STORAGE_KEYS.applications
    );

    setUsers(savedUsers);
    setJobs(savedJobs);
    setApplications(savedApplications);

    setLastUpdated(new Date());
  }, [
    navigate,
    readArrayFromStorage,
  ]);

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
      "storage",
    ];

    const handleDataChange = () => {
      loadAdminData();
    };

    events.forEach((eventName) => {
      window.addEventListener(
        eventName,
        handleDataChange
      );
    });

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(
          eventName,
          handleDataChange
        );
      });
    };
  }, [loadAdminData]);

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
    }, 500);
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem(
      STORAGE_KEYS.currentUser
    );

    setAdmin(null);

    window.dispatchEvent(
      new Event("userLogout")
    );

    navigate("/", { replace: true });
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
      alert("User not found.");
      return;
    }

    /* ---------------------------------------------
       PROTECT ADMIN ACCOUNTS
    --------------------------------------------- */

    if (userToDelete.role === "admin") {
      alert("Admin accounts cannot be deleted.");
      return;
    }

    /* ---------------------------------------------
       PROTECT CURRENT ADMIN
    --------------------------------------------- */

    if (
      admin &&
      String(userToDelete.id) ===
        String(admin.id)
    ) {
      alert(
        "You cannot delete the currently logged-in admin."
      );

      return;
    }

    /* ---------------------------------------------
       CONFIRM
    --------------------------------------------- */

    const confirmDelete = window.confirm(
      `Delete ${
        userToDelete.name || "this user"
      }?\n\n` +
        "This will also remove their related jobs and applications."
    );

    if (!confirmDelete) {
      return;
    }

    /* ---------------------------------------------
       FIND USER JOBS
    --------------------------------------------- */

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

    /* ---------------------------------------------
       REMOVE USER
    --------------------------------------------- */

    const updatedUsers = users.filter(
      (user) =>
        String(user.id) !==
        String(userId)
    );

    /* ---------------------------------------------
       REMOVE JOBS
    --------------------------------------------- */

    const updatedJobs = jobs.filter(
      (job) =>
        !recruiterJobIds.includes(
          String(job.id)
        )
    );

    /* ---------------------------------------------
       REMOVE RELATED APPLICATIONS
    --------------------------------------------- */

    const updatedApplications =
      applications.filter(
        (application) => {
          const belongsToCandidate =
            String(application.userId) ===
              String(userId) ||
            String(application.candidateId) ===
              String(userId);

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

    /* ---------------------------------------------
       SAVE ALL CHANGES
    --------------------------------------------- */

    const usersSaved =
      saveArrayToStorage(
        STORAGE_KEYS.users,
        updatedUsers
      );

    const jobsSaved =
      saveArrayToStorage(
        STORAGE_KEYS.jobs,
        updatedJobs
      );

    const applicationsSaved =
      saveArrayToStorage(
        STORAGE_KEYS.applications,
        updatedApplications
      );

    if (
      !usersSaved ||
      !jobsSaved ||
      !applicationsSaved
    ) {
      return;
    }

    /* ---------------------------------------------
       UPDATE STATE
    --------------------------------------------- */

    setUsers(updatedUsers);
    setJobs(updatedJobs);
    setApplications(
      updatedApplications
    );

    setLastUpdated(new Date());

    /* ---------------------------------------------
       EVENTS
    --------------------------------------------- */

    window.dispatchEvent(
      new Event("userDeleted")
    );

    window.dispatchEvent(
      new Event("jobDeleted")
    );

    window.dispatchEvent(
      new Event("applicationsUpdated")
    );

    alert(
      `${userToDelete.name || "User"} deleted successfully.`
    );
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
      alert("Job not found.");
      return;
    }

    const relatedApplications =
      applications.filter(
        (application) =>
          String(application.jobId) ===
          String(jobId)
      );

    const confirmDelete = window.confirm(
      `Delete "${
        jobToDelete.title ||
        "this job"
      }"?\n\n` +
        `${relatedApplications.length} related application(s) will also be deleted.`
    );

    if (!confirmDelete) {
      return;
    }

    /* ---------------------------------------------
       REMOVE JOB
    --------------------------------------------- */

    const updatedJobs = jobs.filter(
      (job) =>
        String(job.id) !==
        String(jobId)
    );

    /* ---------------------------------------------
       REMOVE APPLICATIONS
    --------------------------------------------- */

    const updatedApplications =
      applications.filter(
        (application) =>
          String(application.jobId) !==
          String(jobId)
      );

    /* ---------------------------------------------
       SAVE
    --------------------------------------------- */

    const jobsSaved =
      saveArrayToStorage(
        STORAGE_KEYS.jobs,
        updatedJobs
      );

    const applicationsSaved =
      saveArrayToStorage(
        STORAGE_KEYS.applications,
        updatedApplications
      );

    if (
      !jobsSaved ||
      !applicationsSaved
    ) {
      return;
    }

    /* ---------------------------------------------
       UPDATE STATE
    --------------------------------------------- */

    setJobs(updatedJobs);

    setApplications(
      updatedApplications
    );

    setLastUpdated(new Date());

    /* ---------------------------------------------
       EVENTS
    --------------------------------------------- */

    window.dispatchEvent(
      new Event("jobDeleted")
    );

    window.dispatchEvent(
      new Event("applicationsUpdated")
    );

    alert(
      "Job and related applications deleted successfully."
    );
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
      alert("Application not found.");
      return;
    }

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this application?"
      );

    if (!confirmDelete) {
      return;
    }

    const updatedApplications =
      applications.filter(
        (item) =>
          String(item.id) !==
          String(applicationId)
      );

    const saved =
      saveArrayToStorage(
        STORAGE_KEYS.applications,
        updatedApplications
      );

    if (!saved) {
      return;
    }

    setApplications(
      updatedApplications
    );

    setLastUpdated(new Date());

    window.dispatchEvent(
      new Event("applicationsUpdated")
    );

    alert(
      "Application deleted successfully."
    );
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
      alert("Application not found.");
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
            updatedAt:
              new Date().toISOString(),
          };
        }
      );

    const saved =
      saveArrayToStorage(
        STORAGE_KEYS.applications,
        updatedApplications
      );

    if (!saved) {
      return;
    }

    setApplications(
      updatedApplications
    );

    setLastUpdated(new Date());

    window.dispatchEvent(
      new Event("applicationsUpdated")
    );
  };

  /* =====================================================
     CLEAR FILTERS
  ===================================================== */

  const clearUserFilters = () => {
    setUserSearch("");
    setUserRoleFilter("all");
  };

  const clearJobFilters = () => {
    setJobSearch("");
    setJobTypeFilter("all");
  };

  const clearApplicationFilters = () => {
    setApplicationSearch("");
    setApplicationStatusFilter("all");
  };

  /* =====================================================
     USER COUNTS
  ===================================================== */

  const candidateCount = useMemo(
    () =>
      users.filter(
        (user) =>
          user.role === "candidate"
      ).length,
    [users]
  );

  const recruiterCount = useMemo(
    () =>
      users.filter(
        (user) =>
          user.role === "recruiter"
      ).length,
    [users]
  );

  const adminCount = useMemo(
    () =>
      users.filter(
        (user) =>
          user.role === "admin"
      ).length,
    [users]
  );

  /* =====================================================
     JOB TYPES
  ===================================================== */

  const jobTypes = useMemo(() => {
    const types = jobs
      .map((job) =>
        String(job.type || "").trim()
      )
      .filter(Boolean);

    return [...new Set(types)];
  }, [jobs]);

  /* =====================================================
     APPLICATION COUNTS
  ===================================================== */

  const applicationCounts =
    useMemo(() => {
      let applied = 0;
      let pending = 0;
      let accepted = 0;
      let rejected = 0;

      applications.forEach(
        (application) => {
          const status =
            application.status ||
            "Applied";

          if (status === "Applied") {
            applied++;
          } else if (
            status === "Pending"
          ) {
            pending++;
          } else if (
            status === "Accepted"
          ) {
            accepted++;
          } else if (
            status === "Rejected"
          ) {
            rejected++;
          } else {
            applied++;
          }
        }
      );

      return {
        applied,
        pending,
        accepted,
        rejected,
      };
    }, [applications]);

  const pendingCount =
    applicationCounts.applied +
    applicationCounts.pending;

  const acceptedCount =
    applicationCounts.accepted;

  const rejectedCount =
    applicationCounts.rejected;

  /* =====================================================
     USER FILTERS
  ===================================================== */

  const filteredUsers = useMemo(() => {
    const search =
      normalize(userSearch);

    return users.filter(
      (user) => {
        const userName =
          normalize(user.name);

        const userEmail =
          normalize(user.email);

        const matchesSearch =
          !search ||
          userName.includes(search) ||
          userEmail.includes(search);

        const matchesRole =
          userRoleFilter === "all" ||
          user.role ===
            userRoleFilter;

        return (
          matchesSearch &&
          matchesRole
        );
      }
    );
  }, [
    users,
    userSearch,
    userRoleFilter,
    normalize,
  ]);

  /* =====================================================
     JOB FILTERS
  ===================================================== */

  const filteredJobs = useMemo(() => {
    const search =
      normalize(jobSearch);

    return jobs.filter((job) => {
      const title =
        normalize(job.title);

      const company =
        normalize(job.company);

      const location =
        normalize(job.location);

      const type =
        normalize(job.type);

      const matchesSearch =
        !search ||
        title.includes(search) ||
        company.includes(search) ||
        location.includes(search) ||
        type.includes(search);

      const matchesType =
        jobTypeFilter === "all" ||
        String(job.type || "") ===
          String(jobTypeFilter);

      return (
        matchesSearch &&
        matchesType
      );
    });
  }, [
    jobs,
    jobSearch,
    jobTypeFilter,
    normalize,
  ]);

  /* =====================================================
     APPLICATION FILTERS
  ===================================================== */

  const filteredApplications =
    useMemo(() => {
      const search =
        normalize(applicationSearch);

      return applications.filter(
        (application) => {
          const currentStatus =
            application.status ||
            "Applied";

          const candidateName =
            normalize(
              application.candidateName
            );

          const candidateEmail =
            normalize(
              application.candidateEmail ||
                application.userEmail
            );

          const jobTitle =
            normalize(
              application.title ||
                application.jobTitle
            );

          const company =
            normalize(
              application.company
            );

          const matchesSearch =
            !search ||
            candidateName.includes(
              search
            ) ||
            candidateEmail.includes(
              search
            ) ||
            jobTitle.includes(search) ||
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
      normalize,
    ]);

  /* =====================================================
     RECENT APPLICATIONS
  ===================================================== */

  const recentApplications =
    useMemo(() => {
      return [...applications]
        .sort((a, b) => {
          const dateA =
            new Date(
              a.appliedAt ||
                a.createdAt ||
                0
            ).getTime();

          const dateB =
            new Date(
              b.appliedAt ||
                b.createdAt ||
                0
            ).getTime();

          return dateB - dateA;
        })
        .slice(0, 5);
    }, [applications]);

  /* =====================================================
     JOB APPLICATION COUNTS
  ===================================================== */

  const jobApplicationCounts =
    useMemo(() => {
      const counts = {};

      applications.forEach(
        (application) => {
          const jobId =
            String(
              application.jobId
            );

          counts[jobId] =
            (counts[jobId] || 0) + 1;
        }
      );

      return counts;
    }, [applications]);

  /* =====================================================
     RECRUITER LOOKUP
  ===================================================== */

  const usersById = useMemo(() => {
    const map = {};

    users.forEach((user) => {
      map[String(user.id)] =
        user;
    });

    return map;
  }, [users]);

  /* =====================================================
     PLATFORM STATISTICS
  ===================================================== */

  const averageApplicationsPerJob =
    jobs.length > 0
      ? (
          applications.length /
          jobs.length
        ).toFixed(1)
      : "0.0";

  const applicationSuccessRate =
    applications.length > 0
      ? (
          (acceptedCount /
            applications.length) *
          100
        ).toFixed(1)
      : "0.0";

  /* =====================================================
     LOADING / AUTH
  ===================================================== */

  if (!admin) {
    return null;
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="dashboard-page">

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
                ? "Refreshing..."
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
              <span>Total Users</span>

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
              <span>Candidates</span>

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
              <span>Recruiters</span>

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
              <span>Total Jobs</span>

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
              <span>Applications</span>

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
                <span>Admins</span>

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
                <span>Pending</span>

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
                <span>Accepted</span>

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
                <span>Rejected</span>

                <strong>
                  {rejectedCount}
                </strong>
              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            ANALYTICS
        ================================================= */}

        <div className="dashboard-section">

          <div className="section-title">

            <h2>
              Platform Analytics
            </h2>

            <p>
              Quick performance indicators
              for JobConnect.
            </p>

          </div>

          <div className="dashboard-stats">

            <div className="stat-card">

              <div className="stat-icon">
                📊
              </div>

              <div>
                <span>
                  Avg. Applications / Job
                </span>

                <strong>
                  {averageApplicationsPerJob}
                </strong>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                📈
              </div>

              <div>
                <span>
                  Acceptance Rate
                </span>

                <strong>
                  {applicationSuccessRate}%
                </strong>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                🧑‍💼
              </div>

              <div>
                <span>
                  Recruiter Jobs
                </span>

                <strong>
                  {jobs.length}
                </strong>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                🔎
              </div>

              <div>
                <span>
                  Visible Applications
                </span>

                <strong>
                  {filteredApplications.length}
                </strong>
              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            USERS SECTION
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

            {(userSearch ||
              userRoleFilter !==
                "all") && (
              <button
                type="button"
                className="dashboard-post-btn"
                onClick={
                  clearUserFilters
                }
              >
                Clear
              </button>
            )}

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

          ) : filteredUsers.length ===
            0 ? (

            <div className="empty-dashboard">

              <div className="empty-icon">
                🔎
              </div>

              <h3>
                No matching users
              </h3>

              <p>
                Try changing your search
                or role filter.
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
                            {getUserName(user)}
                          </h3>

                          <p>
                            📧{" "}
                            {user.email ||
                              "No email"}
                          </p>

                        </div>

                        <span className="application-status">
                          {user.role ===
                          "admin"
                            ? "Admin"
                            : user.role ===
                              "recruiter"
                            ? "Recruiter"
                            : "Candidate"}
                        </span>

                      </div>

                      <div className="candidate-details">

                        <span>
                          🆔 ID:{" "}
                          {user.id ??
                            "N/A"}
                        </span>

                        {user.createdAt && (
                          <span>
                            📅 Registered:{" "}
                            {formatDate(
                              user.createdAt
                            )}
                          </span>
                        )}

                      </div>

                      <div className="application-actions">

                        {user.role ===
                        "admin" ? (

                          <span
                            style={{
                              opacity: 0.65,
                              fontSize:
                                "14px",
                            }}
                          >
                            🛡️ Protected
                            account
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
            JOBS SECTION
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

            {(jobSearch ||
              jobTypeFilter !==
                "all") && (
              <button
                type="button"
                className="dashboard-post-btn"
                onClick={
                  clearJobFilters
                }
              >
                Clear
              </button>
            )}

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

          ) : filteredJobs.length ===
            0 ? (

            <div className="empty-dashboard">

              <div className="empty-icon">
                🔎
              </div>

              <h3>
                No matching jobs
              </h3>

              <p>
                Try changing your search
                or job type filter.
              </p>

            </div>

          ) : (

            <div className="recruiter-jobs">

              {filteredJobs.map(
                (job) => {

                  const jobApplicationCount =
                    jobApplicationCounts[
                      String(job.id)
                    ] || 0;

                  const recruiterId =
                    getJobRecruiterId(
                      job
                    );

                  const recruiter =
                    recruiterId !==
                    null
                      ? usersById[
                          String(
                            recruiterId
                          )
                        ]
                      : null;

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
                            {getUserName(
                              recruiter
                            )}
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

                        {job.createdAt && (
                          <p>
                            📅 Posted:{" "}
                            {formatDate(
                              job.createdAt
                            )}
                          </p>
                        )}

                      </div>

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

        {/* =================================================
            APPLICATIONS SECTION
        ================================================= */}

        <div className="dashboard-section">

          <div className="section-title">

            <h2>
              All Applications
            </h2>

            <p>
              Review and manage
              applications submitted by
              candidates.
            </p>

          </div>

          <div className="dashboard-stats">

            <div className="stat-card">

              <div className="stat-icon">
                📝
              </div>

              <div>

                <span>
                  Applied
                </span>

                <strong>
                  {
                    applicationCounts.applied
                  }
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
                  {
                    applicationCounts.pending
                  }
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
                  {
                    applicationCounts.accepted
                  }
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
                  {
                    applicationCounts.rejected
                  }
                </strong>

              </div>

            </div>

          </div>

          <div className="admin-filters">

            <input
              type="text"
              placeholder="🔎 Search candidate, email, job or company..."
              value={
                applicationSearch
              }
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

            {(applicationSearch ||
              applicationStatusFilter !==
                "all") && (
              <button
                type="button"
                className="dashboard-post-btn"
                onClick={
                  clearApplicationFilters
                }
              >
                Clear
              </button>
            )}

          </div>

          {applications.length ===
          0 ? (

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

          ) : filteredApplications.length ===
            0 ? (

            <div className="empty-dashboard">

              <div className="empty-icon">
                🔎
              </div>

              <h3>
                No matching applications
              </h3>

              <p>
                Try changing your search
                or status filter.
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
                    getStatusClass(
                      currentStatus
                    );

                  return (

                    <div
                      className="recruiter-application-card"
                      key={
                        application.id
                      }
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
                              {application.candidateName ||
                                "Candidate"}
                            </h3>

                            <p>
                              📧{" "}
                              {application.candidateEmail ||
                                application.userEmail ||
                                "No email"}
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
                            {application.title ||
                              application.jobTitle ||
                              "Job"}
                          </span>

                          <span>
                            🏢{" "}
                            {application.company ||
                              "Company"}
                          </span>

                          <span>
                            📅{" "}
                            {formatDate(
                              application.appliedAt ||
                                application.createdAt
                            )}
                          </span>

                        </div>

                        <div className="application-actions">

                          <select
                            value={
                              currentStatus
                            }
                            onChange={(
                              event
                            ) =>
                              updateApplicationStatus(
                                application.id,
                                event.target
                                  .value
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
                            🗑️ Delete
                            Application
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
            RECENT ACTIVITY
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

          {recentApplications.length ===
          0 ? (

            <div className="empty-dashboard">

              <div className="empty-icon">
                📊
              </div>

              <h3>
                No recent activity
              </h3>

              <p>
                Application activity
                will appear here.
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
                    getStatusClass(
                      status
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
                              {application.candidateName ||
                                "Candidate"}
                            </h3>

                            <p>
                              Applied for{" "}
                              {application.title ||
                                application.jobTitle ||
                                "a job"}
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
                            {application.company ||
                              "Company"}
                          </span>

                          <span>
                            📅{" "}
                            {formatDate(
                              application.appliedAt ||
                                application.createdAt
                            )}
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

    </div>
  );
}

export default AdminDashboard;