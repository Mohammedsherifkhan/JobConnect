import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./PostJob.css";

function PostJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    experience: "",
    salary: "",
    skills: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check logged-in recruiter
    const savedUser = localStorage.getItem(
      "jobconnect_current_user"
    );

    if (!savedUser) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    const currentUser = JSON.parse(savedUser);

    // Check recruiter role
    if (currentUser.role !== "recruiter") {
      alert("Only recruiters can post jobs.");
      navigate("/");
      return;
    }

    // Validate form
    if (
      !formData.title ||
      !formData.company ||
      !formData.location ||
      !formData.type ||
      !formData.experience ||
      !formData.salary ||
      !formData.skills ||
      !formData.description
    ) {
      alert("Please fill all fields.");
      return;
    }

    // Create new job
    const newJob = {
      id: Date.now(),

      title: formData.title,

      company: formData.company,

      location: formData.location,

      type: formData.type,

      experience: formData.experience,

      salary: formData.salary,

      posted: "Just now",

      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== ""),

      description: formData.description,

      // Recruiter information
      recruiterId: currentUser.id,

      recruiterName: currentUser.name,

      recruiterEmail: currentUser.email,
    };

    // Get existing jobs
    const existingJobs =
      JSON.parse(
        localStorage.getItem("jobconnect_jobs")
      ) || [];

    // Add new job
    const updatedJobs = [
      ...existingJobs,
      newJob,
    ];

    // Save jobs
    localStorage.setItem(
      "jobconnect_jobs",
      JSON.stringify(updatedJobs)
    );

    // Notify other components
    window.dispatchEvent(
      new Event("jobPosted")
    );

    alert("Job posted successfully!");

    // Go to recruiter dashboard
    navigate("/recruiter-dashboard");
  };

  return (
    <div className="post-job-page">

      <div className="post-job-container">

        {/* HEADER */}

        <div className="post-job-header">

          <span>
            RECRUITER
          </span>

          <h1>
            Post a New Job
          </h1>

          <p>
            Find the right candidate for your company.
          </p>

        </div>


        {/* FORM */}

        <form
          className="post-job-form"
          onSubmit={handleSubmit}
        >

          {/* JOB TITLE */}

          <div className="form-group">

            <label>
              Job Title
            </label>

            <input
              type="text"
              name="title"
              placeholder="e.g. Frontend Developer"
              value={formData.title}
              onChange={handleChange}
            />

          </div>


          {/* COMPANY */}

          <div className="form-group">

            <label>
              Company Name
            </label>

            <input
              type="text"
              name="company"
              placeholder="e.g. TechNova"
              value={formData.company}
              onChange={handleChange}
            />

          </div>


          {/* LOCATION */}

          <div className="form-group">

            <label>
              Location
            </label>

            <input
              type="text"
              name="location"
              placeholder="e.g. Chennai"
              value={formData.location}
              onChange={handleChange}
            />

          </div>


          {/* JOB TYPE */}

          <div className="form-group">

            <label>
              Job Type
            </label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >

              <option value="">
                Select job type
              </option>

              <option value="Full Time">
                Full Time
              </option>

              <option value="Part Time">
                Part Time
              </option>

              <option value="Internship">
                Internship
              </option>

              <option value="Remote">
                Remote
              </option>

            </select>

          </div>


          {/* EXPERIENCE */}

          <div className="form-group">

            <label>
              Experience
            </label>

            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
            >

              <option value="">
                Select experience
              </option>

              <option value="Fresher">
                Fresher
              </option>

              <option value="1-2 Years">
                1-2 Years
              </option>

              <option value="2-4 Years">
                2-4 Years
              </option>

              <option value="5+ Years">
                5+ Years
              </option>

            </select>

          </div>


          {/* SALARY */}

          <div className="form-group">

            <label>
              Salary
            </label>

            <input
              type="text"
              name="salary"
              placeholder="e.g. ₹5 - ₹8 LPA"
              value={formData.salary}
              onChange={handleChange}
            />

          </div>


          {/* SKILLS */}

          <div className="form-group">

            <label>
              Skills
            </label>

            <input
              type="text"
              name="skills"
              placeholder="React, JavaScript, CSS"
              value={formData.skills}
              onChange={handleChange}
            />

            <small>
              Separate skills using commas.
            </small>

          </div>


          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              Job Description
            </label>

            <textarea
              name="description"
              rows="6"
              placeholder="Describe the job responsibilities and requirements..."
              value={formData.description}
              onChange={handleChange}
            />

          </div>


          {/* SUBMIT */}

          <button
            type="submit"
            className="post-job-button"
          >
            Post Job
          </button>

        </form>

      </div>

    </div>
  );
}

export default PostJob;