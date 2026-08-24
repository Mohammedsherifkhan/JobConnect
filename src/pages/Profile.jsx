import { useEffect, useState } from "react";
import "../Profile.css";

function Profile() {
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Your Name",
    email: "your@email.com",
    phone: "+91 98765 43210",
    location: "Coimbatore, Tamil Nadu",
    headline: "Computer Science Student",
    bio: "Passionate about software development and looking for exciting opportunities.",
  });

  const [skills, setSkills] = useState([
    "Java",
    "React",
    "JavaScript",
    "HTML",
    "CSS",
  ]);

  const [newSkill, setNewSkill] = useState("");
  const [photo, setPhoto] = useState(null);
  const [resume, setResume] = useState(null);

  /* =====================================================
     LOAD SAVED PROFILE
  ===================================================== */

  useEffect(() => {
    const savedProfile = localStorage.getItem(
      "jobconnect_profile"
    );

    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error(
          "Failed to load profile:",
          error
        );
      }
    }

    const savedSkills = localStorage.getItem(
      "jobconnect_skills"
    );

    if (savedSkills) {
      try {
        setSkills(JSON.parse(savedSkills));
      } catch (error) {
        console.error(
          "Failed to load skills:",
          error
        );
      }
    }

    const savedPhoto = localStorage.getItem(
      "jobconnect_profile_photo"
    );

    if (savedPhoto) {
      setPhoto(savedPhoto);
    }

    const savedResume = localStorage.getItem(
      "jobconnect_resume"
    );

    if (savedResume) {
      try {
        setResume(JSON.parse(savedResume));
      } catch (error) {
        console.error(
          "Failed to load resume:",
          error
        );
      }
    }
  }, []);

  /* =====================================================
     PROFILE CHANGE
  ===================================================== */

  const handleChange = (event) => {
    setProfile({
      ...profile,
      [event.target.name]: event.target.value,
    });
  };

  /* =====================================================
     PROFILE PHOTO
  ===================================================== */

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert(
        "Profile image must be less than 2 MB."
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result;

      setPhoto(imageData);

      localStorage.setItem(
        "jobconnect_profile_photo",
        imageData
      );
    };

    reader.readAsDataURL(file);
  };

  /* =====================================================
     RESUME UPLOAD
  ===================================================== */

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const extensionAllowed =
      /\.(pdf|doc|docx)$/i.test(file.name);

    if (
      !allowedTypes.includes(file.type) &&
      !extensionAllowed
    ) {
      alert(
        "Please upload a PDF, DOC, or DOCX file."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(
        "Resume must be less than 5 MB."
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const resumeData = {
        name: file.name,
        size: file.size,
        type: file.type,
        data: reader.result,
        uploadedAt:
          new Date().toLocaleString(),
      };

      setResume(resumeData);

      localStorage.setItem(
        "jobconnect_resume",
        JSON.stringify(resumeData)
      );

      alert(
        "Resume uploaded successfully!"
      );
    };

    reader.onerror = () => {
      alert(
        "Unable to read the resume file."
      );
    };

    reader.readAsDataURL(file);
  };

  /* =====================================================
     REMOVE RESUME
  ===================================================== */

  const removeResume = () => {
    setResume(null);

    localStorage.removeItem(
      "jobconnect_resume"
    );

    alert("Resume removed.");
  };

  /* =====================================================
     ADD SKILL
  ===================================================== */

  const addSkill = () => {
    const skill = newSkill.trim();

    if (!skill) return;

    const alreadyExists = skills.some(
      (item) =>
        item.toLowerCase() ===
        skill.toLowerCase()
    );

    if (alreadyExists) {
      setNewSkill("");
      return;
    }

    const updatedSkills = [
      ...skills,
      skill,
    ];

    setSkills(updatedSkills);

    localStorage.setItem(
      "jobconnect_skills",
      JSON.stringify(updatedSkills)
    );

    setNewSkill("");
  };

  /* =====================================================
     REMOVE SKILL
  ===================================================== */

  const removeSkill = (skillToRemove) => {
    const updatedSkills =
      skills.filter(
        (skill) =>
          skill !== skillToRemove
      );

    setSkills(updatedSkills);

    localStorage.setItem(
      "jobconnect_skills",
      JSON.stringify(updatedSkills)
    );
  };

  /* =====================================================
     SAVE PROFILE
  ===================================================== */

  const saveProfile = () => {
    localStorage.setItem(
      "jobconnect_profile",
      JSON.stringify(profile)
    );

    localStorage.setItem(
      "jobconnect_skills",
      JSON.stringify(skills)
    );

    setEditing(false);

    alert(
      "Profile saved successfully!"
    );
  };

  /* =====================================================
     DOWNLOAD RESUME
  ===================================================== */

  const downloadResume = () => {
    if (!resume?.data) {
      alert("Resume file not found.");
      return;
    }

    const link =
      document.createElement("a");

    link.href = resume.data;
    link.download = resume.name;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  /* =====================================================
     VIEW RESUME
  ===================================================== */

  const viewResume = () => {
    if (!resume?.data) {
      alert("Resume file not found.");
      return;
    }

    const newWindow =
      window.open();

    if (!newWindow) {
      alert(
        "Please allow pop-ups to view the resume."
      );
      return;
    }

    if (
      resume.type ===
      "application/pdf"
    ) {
      newWindow.location.href =
        resume.data;
    } else {
      newWindow.document.write(`
        <html>
          <head>
            <title>${resume.name}</title>
          </head>
          <body style="
            font-family: Arial;
            padding: 40px;
          ">
            <h2>${resume.name}</h2>
            <p>
              This file type cannot be previewed
              directly in the browser.
            </p>
            <p>
              Please download the file to open it.
            </p>
          </body>
        </html>
      `);
    }
  };

  return (
    <div className="profile-page">

      {/* =================================================
          PROFILE HEADER
      ================================================= */}

      <section className="profile-header">

        <div className="profile-cover"></div>

        <div className="profile-header-content">

          {/* PROFILE PHOTO */}

          <div className="profile-photo-container">

            {photo ? (

              <img
                src={photo}
                alt="Profile"
                className="profile-photo"
              />

            ) : (

              <div className="profile-photo placeholder">
                {profile.name
                  .charAt(0)
                  .toUpperCase()}
              </div>

            )}

            {editing && (

              <label className="photo-edit">

                📷

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handlePhotoChange
                  }
                  hidden
                />

              </label>

            )}

          </div>


          {/* PROFILE TITLE */}

          <div className="profile-title">

            <h1>
              {profile.name}
            </h1>

            <p>
              {profile.headline}
            </p>

            <span>
              📍 {profile.location}
            </span>

          </div>


          {/* EDIT BUTTON */}

          <button
            className="edit-profile-btn"
            onClick={() =>
              editing
                ? saveProfile()
                : setEditing(true)
            }
          >
            {editing
              ? "✓ Save Profile"
              : "✏ Edit Profile"}
          </button>

        </div>

      </section>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="profile-main">

        <div className="profile-grid">

          {/* =================================================
              LEFT
          ================================================= */}

          <div className="profile-left">

            {/* PERSONAL INFORMATION */}

            <section className="profile-card">

              <div className="card-heading">

                <span>
                  PROFILE
                </span>

                <h2>
                  Personal Information
                </h2>

              </div>


              <div className="form-grid">

                {/* NAME */}

                <div className="form-field">

                  <label>
                    Full Name
                  </label>

                  {editing ? (

                    <input
                      name="name"
                      value={
                        profile.name
                      }
                      onChange={
                        handleChange
                      }
                    />

                  ) : (

                    <p>
                      {profile.name}
                    </p>

                  )}

                </div>


                {/* EMAIL */}

                <div className="form-field">

                  <label>
                    Email
                  </label>

                  {editing ? (

                    <input
                      name="email"
                      type="email"
                      value={
                        profile.email
                      }
                      onChange={
                        handleChange
                      }
                    />

                  ) : (

                    <p>
                      {profile.email}
                    </p>

                  )}

                </div>


                {/* PHONE */}

                <div className="form-field">

                  <label>
                    Phone
                  </label>

                  {editing ? (

                    <input
                      name="phone"
                      value={
                        profile.phone
                      }
                      onChange={
                        handleChange
                      }
                    />

                  ) : (

                    <p>
                      {profile.phone}
                    </p>

                  )}

                </div>


                {/* LOCATION */}

                <div className="form-field">

                  <label>
                    Location
                  </label>

                  {editing ? (

                    <input
                      name="location"
                      value={
                        profile.location
                      }
                      onChange={
                        handleChange
                      }
                    />

                  ) : (

                    <p>
                      {profile.location}
                    </p>

                  )}

                </div>

              </div>

            </section>


            {/* ABOUT */}

            <section className="profile-card">

              <div className="card-heading">

                <span>
                  ABOUT
                </span>

                <h2>
                  About Me
                </h2>

              </div>

              {editing ? (

                <textarea
                  name="bio"
                  rows="5"
                  value={
                    profile.bio
                  }
                  onChange={
                    handleChange
                  }
                />

              ) : (

                <p className="bio-text">
                  {profile.bio}
                </p>

              )}

            </section>


            {/* SKILLS */}

            <section className="profile-card">

              <div className="card-heading">

                <span>
                  EXPERTISE
                </span>

                <h2>
                  Skills
                </h2>

              </div>


              <div className="skills-list">

                {skills.map(
                  (skill) => (

                    <div
                      className="skill-tag"
                      key={skill}
                    >

                      {skill}

                      {editing && (

                        <button
                          type="button"
                          onClick={() =>
                            removeSkill(
                              skill
                            )
                          }
                        >
                          ×
                        </button>

                      )}

                    </div>

                  )
                )}

              </div>


              {editing && (

                <div className="add-skill">

                  <input
                    type="text"
                    placeholder="Add a skill"
                    value={
                      newSkill
                    }
                    onChange={(
                      event
                    ) =>
                      setNewSkill(
                        event.target.value
                      )
                    }
                    onKeyDown={(
                      event
                    ) => {

                      if (
                        event.key ===
                        "Enter"
                      ) {

                        event.preventDefault();

                        addSkill();

                      }

                    }}
                  />

                  <button
                    type="button"
                    onClick={
                      addSkill
                    }
                  >
                    + Add
                  </button>

                </div>

              )}

            </section>

          </div>


          {/* =================================================
              RIGHT
          ================================================= */}

          <aside className="profile-right">

            {/* RESUME */}

            <section className="profile-card">

              <div className="card-heading">

                <span>
                  DOCUMENT
                </span>

                <h2>
                  My Resume
                </h2>

              </div>


              {resume ? (

                <div className="resume-file">

                  <div className="resume-icon">
                    📄
                  </div>


                  <div className="resume-info">

                    <strong>
                      {resume.name}
                    </strong>

                    <small>
                      {(
                        resume.size /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB
                    </small>

                  </div>


                  {/* VIEW */}

                  <button
                    type="button"
                    className="resume-view-btn"
                    onClick={
                      viewResume
                    }
                    title="View Resume"
                  >
                    👁
                  </button>


                  {/* DOWNLOAD */}

                  <button
                    type="button"
                    className="resume-download-btn"
                    onClick={
                      downloadResume
                    }
                    title="Download Resume"
                  >
                    ↓
                  </button>


                  {/* REMOVE */}

                  <button
                    type="button"
                    className="remove-resume"
                    onClick={
                      removeResume
                    }
                    title="Remove Resume"
                  >
                    ×
                  </button>

                </div>

              ) : (

  <label
    className="resume-upload"
    htmlFor="resume-input"
  >

    <div className="upload-icon">
      📄
    </div>

    <strong>
      Upload your resume
    </strong>

    <span>
      Choose a file from your computer
    </span>

    <span>
      PDF, DOC or DOCX • Max 5 MB
    </span>

    <div className="resume-select-text">
      Browse Files
    </div>

    <input
      id="resume-input"
      type="file"
      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      onChange={handleResumeChange}
      hidden
    />

  </label>

)}

            </section>


            {/* PROFILE STRENGTH */}

            <section className="profile-card completion-card">

              <div className="card-heading">

                <span>
                  PROFILE STATUS
                </span>

                <h2>
                  Profile Strength
                </h2>

              </div>


              <div className="completion-circle">
                <strong>
                  80%
                </strong>
              </div>


              <p>
                Complete your profile to improve
                your chances of getting noticed
                by recruiters.
              </p>

            </section>


            {/* CAREER INFORMATION */}

            <section className="profile-card">

              <div className="card-heading">

                <span>
                  CAREER
                </span>

                <h2>
                  Quick Information
                </h2>

              </div>


              <div className="quick-info">

                <div>

                  <span>
                    🎓
                  </span>

                  <p>

                    <strong>
                      Education
                    </strong>

                    <small>
                      Bachelor's Degree
                    </small>

                  </p>

                </div>


                <div>

                  <span>
                    💼
                  </span>

                  <p>

                    <strong>
                      Experience
                    </strong>

                    <small>
                      Fresher
                    </small>

                  </p>

                </div>


                <div>

                  <span>
                    🔎
                  </span>

                  <p>

                    <strong>
                      Looking For
                    </strong>

                    <small>
                      Software Developer
                    </small>

                  </p>

                </div>

              </div>

            </section>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default Profile;