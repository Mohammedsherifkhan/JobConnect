import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import JobCard from "../components/JobCard";
import JobFilters from "../components/JobFilters";
import "../Jobs.css";
const jobs = [
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
  },
];

function Home() {

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [experience, setExperience] = useState("");

  const filteredJobs = useMemo(() => {

    return jobs.filter((job) => {

      const searchText = search.toLowerCase();

      const matchesSearch =
        job.title.toLowerCase().includes(searchText) ||
        job.company.toLowerCase().includes(searchText) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(searchText)
        );

      const matchesLocation =
        !location ||
        job.location === location;

      const matchesType =
        !jobType ||
        job.type === jobType;

      const matchesExperience =
        !experience ||
        job.experience === experience;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesType &&
        matchesExperience
      );
    });

  }, [search, location, jobType, experience]);


  return (
    <div className="home-page">

      {/* NAVBAR */}

      <nav className="navbar">

        <Link to="/" className="logo">
          Job<span>Connect</span>
        </Link>

        <div className="nav-links">

          <a href="#jobs">
            Find Jobs
          </a>

          <a href="#companies">
            Companies
          </a>

          <a href="#about">
            About
          </a>

        </div>

        <div className="nav-actions">

          <Link
            to="/login"
            className="login-link"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="nav-register"
          >
            Register
          </Link>

        </div>

      </nav>


      {/* HERO */}

      <section className="job-hero">

        <div className="hero-content">

          <span className="hero-tag">
            🚀 Your career starts here
          </span>

          <h1>
            Find a job that
            <br />
            <span>moves you forward.</span>
          </h1>

          <p>
            Discover opportunities from top companies,
            build your profile, and take the next step
            in your career.
          </p>

        </div>

      </section>


      {/* JOB SECTION */}

      <main id="jobs" className="jobs-section">

        <div className="section-heading">

          <div>
            <span className="section-label">
              OPPORTUNITIES
            </span>

            <h2>
              Latest job openings
            </h2>

            <p>
              Find your next opportunity from our
              growing list of jobs.
            </p>
          </div>

          <span className="job-count">
            {filteredJobs.length} Jobs Found
          </span>

        </div>


        <JobFilters
          search={search}
          setSearch={setSearch}
          location={location}
          setLocation={setLocation}
          jobType={jobType}
          setJobType={setJobType}
          experience={experience}
          setExperience={setExperience}
        />


        {filteredJobs.length > 0 ? (

          <div className="jobs-grid">

            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
              />
            ))}

          </div>

        ) : (

          <div className="no-jobs">

            <div>
              🔎
            </div>

            <h3>
              No jobs found
            </h3>

            <p>
              Try changing your search or filters.
            </p>

          </div>

        )}

      </main>


      {/* FOOTER */}

      <footer className="footer">

        <div>

          <Link to="/" className="logo">
            Job<span>Connect</span>
          </Link>

          <p>
            Connecting talented people with
            meaningful opportunities.
          </p>

        </div>

        <div className="footer-copy">
          © 2026 JobConnect. All rights reserved.
        </div>

      </footer>

    </div>
  );
}

export default Home;