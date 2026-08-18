import { useState } from "react";
import "./../Profile.css";

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

  const handleChange = (event) => {
    setProfile({
      ...profile,
      [event.target.name]: event.target.value,
    });
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  const handleResumeChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setResume(file);
    }
  };

  const addSkill = () => {
    const skill = newSkill.trim();

    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(
      skills.filter((skill) => skill !== skillToRemove)
    );
  };

  const saveProfile = () => {
    setEditing(false);

    alert("Profile saved successfully!");
  };

  return (
    <div className="profile-page">

      {/* NAVBAR */}

      <nav className="profile-navbar">

        <div className="profile-logo">
          Job<span>Connect</span>
        </div>

        <div className="profile-nav-links">
          <a href="/">Home</a>
          <a href="/#jobs">Find Jobs</a>
          <a href="/profile">Profile</a>
        </div>

      </nav>


      {/* PROFILE HEADER */}

      <section className="profile-header">

        <div className="profile-cover"></div>

        <div className="profile-header-content">

          <div className="profile-photo-container">

            {photo ? (
              <img
                src={photo}
                alt="Profile"
                className="profile-photo"
              />
            ) : (
              <div className="profile-photo placeholder">
                {profile.name.charAt(0)}
              </div>
            )}

            {editing && (
              <label className="photo-edit">

                📷

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  hidden
                />

              </label>
            )}

          </div>


          <div className="profile-title">

            <h1>{profile.name}</h1>

            <p>{profile.headline}</p>

            <span>
              📍 {profile.location}
            </span>

          </div>


          <button
            className="edit-profile-btn"
            onClick={() =>
              editing ? saveProfile() : setEditing(true)
            }
          >
            {editing ? "✓ Save Profile" : "✏ Edit Profile"}
          </button>

        </div>

      </section>


      {/* MAIN */}

      <main className="profile-main">

        <div className="profile-grid">

          {/* LEFT */}

          <div className="profile-left">

            {/* PERSONAL INFORMATION */}

            <section className="profile-card">

              <div className="card-heading">

                <div>
                  <span>PROFILE</span>
                  <h2>Personal Information</h2>
                </div>

              </div>


              <div className="form-grid">

                <div className="form-field">

                  <label>Full Name</label>

                  {editing ? (
                    <input
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                    />
                  ) : (
                    <p>{profile.name}</p>
                  )}

                </div>


                <div className="form-field">

                  <label>Email</label>

                  {editing ? (
                    <input
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                    />
                  ) : (
                    <p>{profile.email}</p>
                  )}

                </div>


                <div className="form-field">

                  <label>Phone</label>

                  {editing ? (
                    <input
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                    />
                  ) : (
                    <p>{profile.phone}</p>
                  )}

                </div>


                <div className="form-field">

                  <label>Location</label>

                  {editing ? (
                    <input
                      name="location"
                      value={profile.location}
                      onChange={handleChange}
                    />
                  ) : (
                    <p>{profile.location}</p>
                  )}

                </div>

              </div>

            </section>


            {/* ABOUT */}

            <section className="profile-card">

              <div className="card-heading">

                <div>
                  <span>ABOUT</span>
                  <h2>About Me</h2>
                </div>

              </div>

              {editing ? (
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows="5"
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

                <div>
                  <span>EXPERTISE</span>
                  <h2>Skills</h2>
                </div>

              </div>


              <div className="skills-list">

                {skills.map((skill) => (

                  <div
                    className="skill-tag"
                    key={skill}
                  >
                    {skill}

                    {editing && (
                      <button
                        onClick={() =>
                          removeSkill(skill)
                        }
                      >
                        ×
                      </button>
                    )}

                  </div>

                ))}

              </div>


              {editing && (

                <div className="add-skill">

                  <input
                    type="text"
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(event) =>
                      setNewSkill(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        addSkill();
                      }
                    }}
                  />

                  <button onClick={addSkill}>
                    + Add
                  </button>

                </div>

              )}

            </section>

          </div>


          {/* RIGHT */}

          <aside className="profile-right">

            {/* RESUME */}

            <section className="profile-card resume-card">

              <div className="card-heading">

                <div>
                  <span>DOCUMENT</span>
                  <h2>My Resume</h2>
                </div>

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
                      {(resume.size / 1024 / 1024).toFixed(2)}
                      {" "}MB
                    </small>

                  </div>

                  <button
                    className="remove-resume"
                    onClick={() => setResume(null)}
                  >
                    ×
                  </button>

                </div>

              ) : (

                <label className="resume-upload">

                  <div className="upload-icon">
                    ↑
                  </div>

                  <strong>
                    Upload your resume
                  </strong>

                  <span>
                    PDF, DOC or DOCX
                  </span>

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange}
                    hidden
                  />

                </label>

              )}

            </section>


            {/* PROFILE COMPLETION */}

            <section className="profile-card completion-card">

              <div className="card-heading">

                <div>
                  <span>PROFILE STATUS</span>
                  <h2>Profile Strength</h2>
                </div>

              </div>

              <div className="completion-circle">
                <strong>80%</strong>
              </div>

              <p>
                Complete your profile to increase
                your chances of getting noticed.
              </p>

            </section>


            {/* QUICK INFO */}

            <section className="profile-card">

              <div className="card-heading">

                <div>
                  <span>CAREER</span>
                  <h2>Quick Information</h2>
                </div>

              </div>

              <div className="quick-info">

                <div>
                  <span>🎓</span>
                  <p>
                    <strong>Education</strong>
                    <small>Bachelor's Degree</small>
                  </p>
                </div>

                <div>
                  <span>💼</span>
                  <p>
                    <strong>Experience</strong>
                    <small>Fresher</small>
                  </p>
                </div>

                <div>
                  <span>🔎</span>
                  <p>
                    <strong>Looking For</strong>
                    <small>Software Developer</small>
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