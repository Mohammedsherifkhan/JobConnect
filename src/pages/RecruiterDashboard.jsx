import { Link } from "react-router-dom";
import "../Recruiter.css";

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    department: "Engineering",
    location: "Chennai",
    type: "Full Time",
    applicants: 42,
    status: "Active",
    posted: "2 days ago",
  },
  {
    id: 2,
    title: "Java Developer",
    department: "Engineering",
    location: "Bangalore",
    type: "Full Time",
    applicants: 31,
    status: "Active",
    posted: "4 days ago",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    department: "Design",
    location: "Remote",
    type: "Remote",
    applicants: 18,
    status: "Closed",
    posted: "1 week ago",
  },
  {
    id: 4,
    title: "Backend Developer",
    department: "Engineering",
    location: "Hyderabad",
    type: "Full Time",
    applicants: 27,
    status: "Active",
    posted: "1 week ago",
  },
];

function RecruiterDashboard() {
  return (
    <div className="recruiter-page">

      <main className="recruiter-container">

        {/* HEADER */}

        <div className="recruiter-header">

          <div>
            <span className="dashboard-label">
              RECRUITER PORTAL
            </span>

            <h1>Good morning, Recruiter 👋</h1>

            <p>
              Manage your jobs, applicants and hiring activity
              from one place.
            </p>
          </div>

          <Link
            to="/recruiter/post-job"
            className="post-job-btn"
          >
            + Post New Job
          </Link>

        </div>


        {/* COMPANY CARD */}

        <section className="company-card">

          <div className="company-avatar">
            TN
          </div>

          <div className="company-details">

            <h2>TechNova Solutions</h2>

            <p>
              Technology • Software Development
            </p>

            <span>
              📍 Chennai, Tamil Nadu
            </span>

          </div>

          <button className="company-edit-btn">
            Edit Company
          </button>

        </section>


        {/* STATISTICS */}

        <section className="recruiter-stats">

          <div className="stat-card">

            <div className="stat-icon">
              💼
            </div>

            <div>
              <span>Total Jobs</span>
              <strong>8</strong>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              🟢
            </div>

            <div>
              <span>Active Jobs</span>
              <strong>6</strong>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              👥
            </div>

            <div>
              <span>Total Applicants</span>
              <strong>124</strong>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              🎯
            </div>

            <div>
              <span>Hired</span>
              <strong>12</strong>
            </div>

          </div>

        </section>


        {/* QUICK ACTIONS */}

        <section className="quick-actions">

          <div className="section-title">

            <div>
              <span>QUICK ACTIONS</span>
              <h2>Manage your hiring</h2>
            </div>

          </div>


          <div className="action-grid">

            <Link
              to="/recruiter/post-job"
              className="action-card"
            >
              <div className="action-icon">
                +
              </div>

              <div>
                <h3>Post a Job</h3>
                <p>
                  Create a new job opening.
                </p>
              </div>

              <span>→</span>
            </Link>


            <Link
              to="#jobs"
              className="action-card"
            >
              <div className="action-icon">
                💼
              </div>

              <div>
                <h3>Manage Jobs</h3>
                <p>
                  View and manage your postings.
                </p>
              </div>

              <span>→</span>
            </Link>


            <Link
              to="#applicants"
              className="action-card"
            >
              <div className="action-icon">
                👥
              </div>

              <div>
                <h3>View Applicants</h3>
                <p>
                  Review candidate applications.
                </p>
              </div>

              <span>→</span>
            </Link>

          </div>

        </section>


        {/* JOBS */}

        <section
          id="jobs"
          className="jobs-management"
        >

          <div className="section-title jobs-title">

            <div>
              <span>JOB POSTINGS</span>
              <h2>Your Recent Jobs</h2>
            </div>

            <button className="view-all-btn">
              View All Jobs
            </button>

          </div>


          <div className="jobs-table-wrapper">

            <table className="jobs-table">

              <thead>

                <tr>
                  <th>Job</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Applicants</th>
                  <th>Status</th>
                  <th>Posted</th>
                  <th></th>
                </tr>

              </thead>

              <tbody>

                {jobs.map((job) => (

                  <tr key={job.id}>

                    <td>

                      <div className="job-table-info">

                        <div className="job-table-icon">
                          {job.title.charAt(0)}
                        </div>

                        <div>
                          <strong>{job.title}</strong>

                          <small>
                            {job.department}
                          </small>
                        </div>

                      </div>

                    </td>

                    <td>
                      {job.location}
                    </td>

                    <td>
                      {job.type}
                    </td>

                    <td>
                      <strong>
                        {job.applicants}
                      </strong>
                    </td>

                    <td>

                      <span
                        className={
                          job.status === "Active"
                            ? "status active"
                            : "status closed"
                        }
                      >
                        {job.status}
                      </span>

                    </td>

                    <td>
                      {job.posted}
                    </td>

                    <td>

                      <button className="more-btn">
                        ⋮
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </section>


        {/* RECENT ACTIVITY */}

        <section
          id="applicants"
          className="activity-section"
        >

          <div className="section-title">

            <div>
              <span>RECENT ACTIVITY</span>
              <h2>Latest applications</h2>
            </div>

          </div>


          <div className="activity-list">

            <div className="activity-item">

              <div className="activity-avatar">
                AK
              </div>

              <div className="activity-content">

                <strong>
                  Arjun Kumar
                </strong>

                <p>
                  Applied for Frontend Developer
                </p>

              </div>

              <small>
                12 min ago
              </small>

            </div>


            <div className="activity-item">

              <div className="activity-avatar">
                PS
              </div>

              <div className="activity-content">

                <strong>
                  Priya Sharma
                </strong>

                <p>
                  Applied for Java Developer
                </p>

              </div>

              <small>
                1 hour ago
              </small>

            </div>


            <div className="activity-item">

              <div className="activity-avatar">
                RM
              </div>

              <div className="activity-content">

                <strong>
                  Rahul M
                </strong>

                <p>
                  Application shortlisted
                </p>

              </div>

              <small>
                3 hours ago
              </small>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default RecruiterDashboard;