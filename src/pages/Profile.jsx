import { useState } from "react";
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

  const handleChange = (event) => {
    setProfile({
      ...profile,
      [event.target.name]: event.target.value,
    });
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Profile image must be less than 2 MB.");
      return;
    }

    setPhoto(URL.createObjectURL(file));
  };

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const extensionAllowed = /\.(pdf|doc|docx)$/i.test(file.name);

    if (!allowedTypes.includes(file.type) && !extensionAllowed) {
      alert("Please upload a PDF, DOC, or DOCX file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Resume must be less than 5 MB.");
      return;
    }

    setResume(file);
  };

  const addSkill = () => {
    const skill = newSkill.trim();

    if (!skill) return;

    const alreadyExists = skills.some(
      (item) => item.toLowerCase() === skill.toLowerCase()
    );

    if (alreadyExists) {
      setNewSkill("");
      return;
    }

    setSkills([...skills, skill]);
    setNewSkill("");
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
                {profile.name.charAt(0).toUpperCase()}
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
            <span>📍 {profile.location}</span>
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

      <main className="profile-main">

        <div className="profile-grid">

          <div className="profile-left">

            {/* Personal Information */}
            <section className="profile-card">

              <div className="card-heading">
                <span>PROFILE</span>
                <h2>Personal Information</h2>
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
                      type="email"
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

            {/* About */}
            <section className="profile-card">

              <div className="card-heading">
                <span>ABOUT</span>
                <h2>About Me</h2>
              </div>

              {editing ? (
                <textarea
                  name="bio"
                  rows="5"
                  value={profile.bio}
                  onChange={handleChange}
                />
              ) : (
                <p className="bio-text">{profile.bio}</p>
              )}

            </section>

            {/* Skills */}
            <section className="profile-card">

              <div className="card-heading">
                <span>EXPERTISE</span>
                <h2>Skills</h2>
              </div>

              <div className="skills-list">
                {skills.map((skill) => (
                  <div className="skill-tag" key={skill}>
                    {skill}

                    {editing && (
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
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
                    placeholder="Add a skill"
                    value={newSkill}
                    onChange={(event) =>
                      setNewSkill(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addSkill();
                      }
                    }}
                  />

                  <button type="button" onClick={addSkill}>
                    + Add
                  </button>
                </div>
              )}

            </section>

          </div>

          <aside className="profile-right">

            {/* Resume */}
            <section className="profile-card">

              <div className="card-heading">
                <span>DOCUMENT</span>
                <h2>My Resume</h2>
              </div>

              {resume ? (
                <div className="resume-file">

                  <div className="resume-icon">📄</div>

                  <div className="resume-info">
                    <strong>{resume.name}</strong>
                    <small>
                      {(resume.size / 1024 / 1024).toFixed(2)} MB
                    </small>
                  </div>

                  <button
                    type="button"
                    className="remove-resume"
                    onClick={() => setResume(null)}
                  >
                    ×
                  </button>

                </div>
              ) : (
                <label className="resume-upload">

                  <div className="upload-icon">↑</div>

                  <strong>Upload your resume</strong>

                  <span>
                    PDF, DOC or DOCX • Max 5 MB
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

            {/* Profile Strength */}
            <section className="profile-card completion-card">

              <div className="card-heading">
                <span>PROFILE STATUS</span>
                <h2>Profile Strength</h2>
              </div>

              <div className="completion-circle">
                <strong>80%</strong>
              </div>

              <p>
                Complete your profile to improve your chances
                of getting noticed by recruiters.
              </p>

            </section>

            {/* Career Information */}
            <section className="profile-card">

              <div className="card-heading">
                <span>CAREER</span>
                <h2>Quick Information</h2>
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