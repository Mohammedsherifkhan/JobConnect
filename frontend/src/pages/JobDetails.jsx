import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import "./JobDetails.css";

const defaultJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechNova",
    location: "Chennai",
    type: "Full Time",
    experience: "Fresher",
    salary: "₹4 - ₹7 LPA",
    posted: "2 hours ago",
    skills: ["React", "JavaScript", "CSS"],
    description:
      "We are looking for a passionate Frontend Developer to build modern and responsive web applications using React and JavaScript.",
  },

  {
    id: 2,
    title: "Java Developer",
    company: "CodeSphere",
    location: "Bangalore",
    type: "Full Time",
    experience: "1-2 Years",
    salary: "₹6 - ₹10 LPA",
    posted: "5 hours ago",
    skills: ["Java", "Spring Boot", "SQL"],
    description:
      "Join our development team and build scalable backend applications using Java, Spring Boot and SQL.",
  },

  {
    id: 3,
    title: "React Intern",
    company: "InnovateLabs",
    location: "Coimbatore",
    type: "Internship",
    experience: "Fresher",
    salary: "₹15K - ₹25K / month",
    posted: "1 day ago",
    skills: ["React", "HTML", "CSS"],
    description:
      "We are looking for a React intern who is interested in learning modern frontend development.",
  },

  {
    id: 4,
    title: "Backend Developer",
    company: "CloudWorks",
    location: "Hyderabad",
    type: "Full Time",
    experience: "2-4 Years",
    salary: "₹8 - ₹14 LPA",
    posted: "1 day ago",
    skills: ["Node.js", "Express", "MongoDB"],
    description:
      "Build reliable backend services and APIs using Node.js, Express and MongoDB.",
  },

  {
    id: 5,
    title: "UI/UX Designer",
    company: "PixelCraft",
    location: "Remote",
    type: "Remote",
    experience: "1-2 Years",
    salary: "₹5 - ₹9 LPA",
    posted: "2 days ago",
    skills: ["Figma", "UI Design", "UX"],
    description:
      "Design beautiful and user-friendly digital experiences for our growing product ecosystem.",
  },

  {
    id: 6,
    title: "Software Engineer",
    company: "NextGen Systems",
    location: "Mumbai",
    type: "Full Time",
    experience: "2-4 Years",
    salary: "₹9 - ₹15 LPA",
    posted: "3 days ago",
    skills: ["Java", "React", "AWS"],
    description:
      "Work with our engineering team to build scalable software solutions using modern technologies.",
  },
];

function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);

  useEffect(() => {
    const savedJobs =
      JSON.parse(
        localStorage.getItem("jobconnect_jobs")
      ) || [];

    const allJobs = [
      ...defaultJobs,
      ...savedJobs,
    ];

    const foundJob = allJobs.find(
      (item) => String(item.id) === String(id)
    );

    setJob(foundJob);
  }, [id]);

  if (!job) {
    return (
      <div className="job-not-found">
        <h2>Job not found</h2>

        <p>
          The job you're looking for doesn't exist.
        </p>

        <Link to="/">
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="job-details-page">

      <div className="job-details-container">

        {/* BACK */}

        <Link
          to="/"
          className="back-link"
        >
          ← Back to Jobs
        </Link>

        {/* HEADER */}

        <div className="job-details-header">

          <div className="company-icon">
            {job.company
              ?.charAt(0)
              .toUpperCase()}
          </div>

          <div>

            <span className="job-details-type">
              {job.type}
            </span>

            <h1>
              {job.title}
            </h1>

            <p className="company-name">
              {job.company}
            </p>

          </div>

        </div>

        {/* JOB INFO */}

        <div className="job-info-grid">

          <div className="job-info-box">
            <span>📍 Location</span>
            <strong>{job.location}</strong>
          </div>

          <div className="job-info-box">
            <span>💼 Experience</span>
            <strong>{job.experience}</strong>
          </div>

          <div className="job-info-box">
            <span>💰 Salary</span>
            <strong>{job.salary}</strong>
          </div>

          <div className="job-info-box">
            <span>🕒 Posted</span>
            <strong>{job.posted}</strong>
          </div>

        </div>

        {/* MAIN CONTENT */}

        <div className="job-details-content">

          <section className="job-description">

            <h2>
              Job Description
            </h2>

            <p>
              {job.description ||
                "No description provided for this job."}
            </p>

          </section>

          {/* SKILLS */}

          <section className="job-skills">

            <h2>
              Required Skills
            </h2>

            <div className="skills-list">

              {job.skills?.map(
                (skill, index) => (
                  <span
                    key={index}
                    className="skill-tag"
                  >
                    {skill}
                  </span>
                )
              )}

            </div>

          </section>

          {/* APPLY */}

          <div className="apply-section">

            <div>
              <h3>
                Interested in this position?
              </h3>

              <p>
                Submit your application and
                take the next step in your career.
              </p>
            </div>

            <Link
              to={`/apply/${job.id}`}
              className="apply-button"
            >
              Apply Now →
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default JobDetails;