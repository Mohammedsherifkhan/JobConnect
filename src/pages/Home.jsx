import { useEffect, useMemo, useState } from "react";
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
  // ================================
  // FILTER STATES
  // ================================

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [experience, setExperience] = useState("");

  // ================================
  // RECRUITER POSTED JOBS
  // ================================

  const [postedJobs, setPostedJobs] = useState([]);

  // Load jobs from localStorage
  useEffect(() => {
    const savedJobs =
      JSON.parse(
        localStorage.getItem("jobconnect_jobs")
      ) || [];

    setPostedJobs(savedJobs);
  }, []);

  // ================================
  // COMBINE ALL JOBS
  // ================================

  const allJobs = [
    ...jobs,
    ...postedJobs,
  ];

  // ================================
  // FILTER JOBS
  // ================================

  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      const searchText =
        search.trim().toLowerCase();

      // Search
      const matchesSearch =
        !searchText ||
        job.title
          ?.toLowerCase()
          .includes(searchText) ||
        job.company
          ?.toLowerCase()
          .includes(searchText) ||
        job.location
          ?.toLowerCase()
          .includes(searchText) ||
        job.skills?.some((skill) =>
          skill
            .toLowerCase()
            .includes(searchText)
        );

      // Location
      const matchesLocation =
        !location ||
        job.location === location;

      // Job type
      const matchesType =
        !jobType ||
        job.type === jobType;

      // Experience
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
  }, [
    allJobs,
    search,
    location,
    jobType,
    experience,
  ]);

  // ================================
  // PAGE
  // ================================

  return (
    <div className="home-page">

      {/* =================================
          HERO SECTION
      ================================= */}

      <section className="job-hero">

        <div className="hero-content">

          <span className="hero-tag">
            🚀 Your career starts here
          </span>

          <h1>
            Find a job that
            <br />

            <span>
              moves you forward.
            </span>
          </h1>

          <p>
            Discover opportunities from top
            companies, build your profile, and
            take the next step in your career.
          </p>

        </div>

      </section>


      {/* =================================
          JOB SECTION
      ================================= */}

      <main
        id="jobs"
        className="jobs-section"
      >

        {/* SECTION HEADER */}

        <div className="section-heading">

          <div>

            <span className="section-label">
              OPPORTUNITIES
            </span>

            <h2>
              Latest job openings
            </h2>

            <p>
              Find your next opportunity from
              our growing list of jobs.
            </p>

          </div>


          {/* JOB COUNT */}

          <span className="job-count">
            {filteredJobs.length} Jobs Found
          </span>

        </div>


        {/* =================================
            FILTERS
        ================================= */}

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


        {/* =================================
            JOB RESULTS
        ================================= */}

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

          /* =================================
             NO JOBS
          ================================= */

          <div className="no-jobs">

            <div className="no-jobs-icon">
              🔎
            </div>

            <h3>
              No jobs found
            </h3>

            <p>
              Try changing your search or
              filters.
            </p>

          </div>

        )}

      </main>


      {/* =================================
          FOOTER
      ================================= */}

      <footer className="footer">

        <div>

          <div className="logo">
            Job<span>Connect</span>
          </div>

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