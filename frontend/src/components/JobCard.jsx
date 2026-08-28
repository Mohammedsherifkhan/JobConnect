import { useNavigate } from "react-router-dom";

function JobCard({ job }) {
  const navigate = useNavigate();

  const handleApply = () => {
    navigate(`/apply/${job.id}`);
  };

  return (
    <article className="job-card">

      {/* TOP */}

      <div className="job-card-top">

        <div className="company-logo">
          {job.company
            ? job.company.charAt(0).toUpperCase()
            : "J"}
        </div>

        <button
          className="favorite-btn"
          type="button"
        >
          ♡
        </button>

      </div>


      {/* JOB TYPE */}

      <div className="job-type">
        {job.type}
      </div>


      {/* TITLE */}

      <h3>
        {job.title}
      </h3>


      {/* COMPANY */}

      <p className="company-name">
        {job.company}
      </p>


      {/* JOB DETAILS */}

      <div className="job-details">

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


      {/* SKILLS */}

      <div className="job-skills">

        {job.skills &&
          job.skills.map((skill, index) => (
            <span key={index}>
              {skill}
            </span>
          ))}

      </div>


      {/* BOTTOM */}

      <div className="job-card-bottom">

        <span className="posted">
          Posted {job.posted}
        </span>

        <button
          className="apply-btn"
          onClick={handleApply}
          type="button"
        >
          Apply Now
        </button>

      </div>

    </article>
  );
}

export default JobCard;