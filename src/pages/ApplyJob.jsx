import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const defaultJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechNova",
    location: "Chennai",
    type: "Full Time",
    experience: "Fresher",
    salary: "₹4 - ₹7 LPA",
    skills: ["React", "JavaScript", "CSS"],
    description:
      "Looking for a passionate Frontend Developer to build modern web applications.",
  },
  {
    id: 2,
    title: "Java Developer",
    company: "CodeSphere",
    location: "Bangalore",
    type: "Full Time",
    experience: "1-2 Years",
    salary: "₹6 - ₹10 LPA",
    skills: ["Java", "Spring Boot", "SQL"],
    description:
      "Develop scalable backend applications using Java and Spring Boot.",
  },
  {
    id: 3,
    title: "React Intern",
    company: "InnovateLabs",
    location: "Coimbatore",
    type: "Internship",
    experience: "Fresher",
    salary: "₹15K - ₹25K / month",
    skills: ["React", "HTML", "CSS"],
    description:
      "Join our frontend team and work on real-world React applications.",
  },
  {
    id: 4,
    title: "Backend Developer",
    company: "CloudWorks",
    location: "Hyderabad",
    type: "Full Time",
    experience: "2-4 Years",
    salary: "₹8 - ₹14 LPA",
    skills: ["Node.js", "Express", "MongoDB"],
    description:
      "Build secure and scalable backend services.",
  },
  {
    id: 5,
    title: "UI/UX Designer",
    company: "PixelCraft",
    location: "Remote",
    type: "Remote",
    experience: "1-2 Years",
    salary: "₹5 - ₹9 LPA",
    skills: ["Figma", "UI Design", "UX"],
    description:
      "Design beautiful and user-friendly digital experiences.",
  },
  {
    id: 6,
    title: "Software Engineer",
    company: "NextGen Systems",
    location: "Mumbai",
    type: "Full Time",
    experience: "2-4 Years",
    salary: "₹9 - ₹15 LPA",
    skills: ["Java", "React", "AWS"],
    description:
      "Develop modern software solutions with our engineering team.",
  },
];

function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  /* =====================================================
     LOAD USER, RESUME AND JOB
  ===================================================== */

  useEffect(() => {
    // -----------------------------
    // LOAD CURRENT USER
    // -----------------------------

    const savedUser = localStorage.getItem(
      "jobconnect_current_user"
    );

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error(
          "Failed to load user:",
          error
        );

        setUser(null);
      }
    }

    // -----------------------------
    // LOAD RESUME
    // -----------------------------

    const savedResume = localStorage.getItem(
      "jobconnect_resume"
    );

    if (savedResume) {
      try {
        const parsedResume =
          JSON.parse(savedResume);

        setResume(parsedResume);
      } catch (error) {
        console.error(
          "Failed to load resume:",
          error
        );

        setResume(null);
      }
    } else {
      setResume(null);
    }

    // -----------------------------
    // LOAD JOBS
    // -----------------------------

    const savedJobs =
      JSON.parse(
        localStorage.getItem(
          "jobconnect_jobs"
        )
      ) || [];

    const allJobs = [
      ...defaultJobs,
      ...savedJobs,
    ];

    const foundJob = allJobs.find(
      (item) =>
        String(item.id) ===
        String(jobId)
    );

    setJob(foundJob || null);
  }, [jobId]);

  /* =====================================================
     SUBMIT APPLICATION
  ===================================================== */

  const handleSubmit = (event) => {
    event.preventDefault();

    // -----------------------------
    // CHECK LOGIN
    // -----------------------------

    if (!user) {
      alert(
        "Please login before applying."
      );

      navigate("/login");

      return;
    }

    // -----------------------------
    // CHECK JOB
    // -----------------------------

    if (!job) {
      alert("Job not found.");

      return;
    }

    // -----------------------------
    // CHECK RESUME
    // -----------------------------

    if (!resume?.data) {
      alert(
        "Please upload your resume from your Profile before applying."
      );

      navigate("/profile");

      return;
    }

    // -----------------------------
    // CHECK COVER LETTER
    // -----------------------------

    if (!coverLetter.trim()) {
      alert(
        "Please enter a cover letter."
      );

      return;
    }

    setLoading(true);

    // -----------------------------
    // GET APPLICATIONS
    // -----------------------------

    const existingApplications =
      JSON.parse(
        localStorage.getItem(
          "jobconnect_applications"
        )
      ) || [];

    // -----------------------------
    // CHECK DUPLICATE APPLICATION
    // -----------------------------

    const alreadyApplied =
      existingApplications.some(
        (application) =>
          String(application.jobId) ===
            String(job.id) &&
          String(application.userEmail) ===
            String(user.email)
      );

    if (alreadyApplied) {
      alert(
        "You have already applied for this job."
      );

      setLoading(false);

      return;
    }

    // -----------------------------
    // CREATE APPLICATION
    // -----------------------------

    const newApplication = {
      id: Date.now(),

      // JOB INFORMATION
      jobId: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      salary: job.salary,
      experience: job.experience,
      skills: job.skills || [],

      // CANDIDATE INFORMATION
      userId: user.id,
      userEmail: user.email,
      candidateName: user.name,
      candidateEmail: user.email,

      // COVER LETTER
      coverLetter:
        coverLetter.trim(),

      // =========================
      // RESUME
      // =========================

      resume: {
        name: resume.name,
        size: resume.size,
        type: resume.type,
        data: resume.data,
      },

      // APPLICATION STATUS
      status: "Applied",

      // APPLICATION DATE
      appliedAt:
        new Date().toLocaleString(),
    };

    // -----------------------------
    // SAVE APPLICATION
    // -----------------------------

    const updatedApplications = [
      ...existingApplications,
      newApplication,
    ];

    localStorage.setItem(
      "jobconnect_applications",
      JSON.stringify(
        updatedApplications
      )
    );

    // -----------------------------
    // REFRESH OTHER PAGES
    // -----------------------------

    window.dispatchEvent(
      new Event(
        "applicationsUpdated"
      )
    );

    setLoading(false);

    alert(
      "Application submitted successfully! 🎉"
    );

    navigate("/applications");
  };

  /* =====================================================
     JOB NOT FOUND
  ===================================================== */

  if (!job) {
    return (
      <div className="apply-page">

        <div className="apply-container">

          <div className="no-jobs">

            <h2>
              Job not found
            </h2>

            <p>
              The job you're trying to
              apply for could not be found.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/")
              }
            >
              Back to Jobs
            </button>

          </div>

        </div>

      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="apply-page">

      <div className="apply-container">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="apply-header">

          <span className="section-label">
            JOB APPLICATION
          </span>

          <h1>
            Apply for {job.title}
          </h1>

          <p>
            {job.company} • {job.location}
          </p>

        </div>


        {/* ==========================================
            JOB INFORMATION
        ========================================== */}

        <div className="application-job-card">

          <h2>
            {job.title}
          </h2>

          <p>
            {job.company}
          </p>

          <div className="job-summary-grid">

            <div>
              <span>
                📍 Location
              </span>

              <strong>
                {job.location}
              </strong>
            </div>

            <div>
              <span>
                💼 Job Type
              </span>

              <strong>
                {job.type}
              </strong>
            </div>

            <div>
              <span>
                🎓 Experience
              </span>

              <strong>
                {job.experience}
              </strong>
            </div>

            <div>
              <span>
                💰 Salary
              </span>

              <strong>
                {job.salary}
              </strong>
            </div>

          </div>

        </div>


        {/* ==========================================
            APPLICATION FORM
        ========================================== */}

        <form
          className="application-form"
          onSubmit={handleSubmit}
        >

          <h2>
            Your Application
          </h2>


          {/* ========================================
              NAME
          ======================================== */}

          <div className="form-group">

            <label>
              Full Name
            </label>

            <input
              type="text"
              value={
                user?.name || ""
              }
              readOnly
            />

          </div>


          {/* ========================================
              EMAIL
          ======================================== */}

          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              value={
                user?.email || ""
              }
              readOnly
            />

          </div>


          {/* ========================================
              RESUME
          ======================================== */}

          <div className="form-group">

            <label>
              Resume
            </label>

            {resume?.data ? (

              <div className="application-resume">

                <span className="application-resume-icon">
                  📄
                </span>

                <div>

                  <strong>
                    {resume.name}
                  </strong>

                  <small>
                    {resume.size
                      ? (
                          resume.size /
                          1024 /
                          1024
                        ).toFixed(2)
                      : "0.00"}{" "}
                    MB
                  </small>

                </div>

                <span className="resume-success">
                  ✓ Uploaded
                </span>

              </div>

            ) : (

              <div className="application-no-resume">

                <span>
                  📄
                </span>

                <div>

                  <strong>
                    No resume found
                  </strong>

                  <p>
                    Please upload your resume
                    before applying.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/profile")
                  }
                >
                  Upload Resume
                </button>

              </div>

            )}

          </div>


          {/* ========================================
              COVER LETTER
          ======================================== */}

          <div className="form-group">

            <label>
              Cover Letter
            </label>

            <textarea
              rows="7"
              value={coverLetter}
              onChange={(event) =>
                setCoverLetter(
                  event.target.value
                )
              }
              placeholder="Tell the recruiter why you are a good fit for this job..."
              required
            />

          </div>


          {/* ========================================
              SUBMIT
          ======================================== */}

          <button
            type="submit"
            className="apply-submit-btn"
            disabled={
              loading ||
              !resume?.data
            }
          >
            {loading
              ? "Submitting..."
              : "Submit Application →"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default ApplyJob;