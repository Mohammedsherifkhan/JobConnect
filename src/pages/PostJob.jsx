import { useState } from "react";
import "./PostJob.css";

function PostJob() {
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
      .map((skill) => skill.trim()),
    description: formData.description,
  };


    // console.log("New Job:", newJob);

    // alert("Job posted successfully!");
    const existingJobs =
  JSON.parse(localStorage.getItem("jobconnect_jobs")) || [];

const updatedJobs = [...existingJobs, newJob];

localStorage.setItem(
  "jobconnect_jobs",
  JSON.stringify(updatedJobs)
);

alert("Job posted successfully!");

    setFormData({
      title: "",
      company: "",
      location: "",
      type: "",
      experience: "",
      salary: "",
      skills: "",
      description: "",
    });
  };

  return (
    <div className="post-job-page">
      <div className="post-job-container">

        <div className="post-job-header">
          <span>RECRUITER</span>

          <h1>Post a New Job</h1>

          <p>
            Find the right candidate for your company.
          </p>
        </div>

        <form
          className="post-job-form"
          onSubmit={handleSubmit}
        >

          {/* Job Title */}

          <div className="form-group">
            <label>Job Title</label>

            <input
              type="text"
              name="title"
              placeholder="e.g. Frontend Developer"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          {/* Company */}

          <div className="form-group">
            <label>Company Name</label>

            <input
              type="text"
              name="company"
              placeholder="e.g. TechNova"
              value={formData.company}
              onChange={handleChange}
            />
          </div>

          {/* Location */}

          <div className="form-group">
            <label>Location</label>

            <input
              type="text"
              name="location"
              placeholder="e.g. Chennai"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          {/* Job Type */}

          <div className="form-group">
            <label>Job Type</label>

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

          {/* Experience */}

          <div className="form-group">
            <label>Experience</label>

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

          {/* Salary */}

          <div className="form-group">
            <label>Salary</label>

            <input
              type="text"
              name="salary"
              placeholder="e.g. ₹5 - ₹8 LPA"
              value={formData.salary}
              onChange={handleChange}
            />
          </div>

          {/* Skills */}

          <div className="form-group">
            <label>Skills</label>

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

          {/* Description */}

          <div className="form-group">
            <label>Job Description</label>

            <textarea
              name="description"
              rows="6"
              placeholder="Describe the job responsibilities and requirements..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Submit */}

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