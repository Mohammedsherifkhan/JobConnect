import { useState } from "react";

function JobCard({ job }) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="job-card">

      <div className="job-card-top">

        <div className="company-logo">
          {job.company.charAt(0)}
        </div>

        <button
          className={`save-job ${saved ? "saved" : ""}`}
          onClick={() => setSaved(!saved)}
          aria-label="Save job"
        >
          {saved ? "♥" : "♡"}
        </button>

      </div>

      <div className="job-content">

        <span className="job-badge">
          {job.type}
        </span>

        <h3>{job.title}</h3>

        <p className="company-name">
          {job.company}
        </p>

        <div className="job-meta">

          <span>
            📍 {job.location}
          </span>

          <span>
            💼 {job.experience}
          </span>

        </div>

        <div className="job-salary">
          💰 {job.salary}
        </div>

        <div className="job-skills">

          {job.skills.map((skill) => (
            <span key={skill}>
              {skill}
            </span>
          ))}

        </div>

      </div>

      <div className="job-card-footer">

        <small>
          Posted {job.posted}
        </small>

        <button className="apply-btn">
          Apply Now →
        </button>

      </div>

    </article>
  );
}

export default JobCard;