import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
      <Navbar />

      <main className="home">

        <section className="hero">

          <div className="hero-badge">
            🚀 Your career starts here
          </div>

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

          <div className="search-container">

            <div className="search-field">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Job title, skills or keywords"
              />
            </div>

            <div className="search-field">
              <span>⌖</span>

              <input
                type="text"
                placeholder="Location"
              />
            </div>

            <button className="search-button">
              Search Jobs
            </button>

          </div>

          <div className="popular">

            <span>Popular:</span>

            <button>React Developer</button>
            <button>Java Developer</button>
            <button>UI/UX Designer</button>
            <button>Data Analyst</button>

          </div>

        </section>


        <section className="stats">

          <div>
            <h2>10K+</h2>
            <p>Active Jobs</p>
          </div>

          <div>
            <h2>5K+</h2>
            <p>Companies</p>
          </div>

          <div>
            <h2>25K+</h2>
            <p>Job Seekers</p>
          </div>

          <div>
            <h2>8K+</h2>
            <p>Successful Hires</p>
          </div>

        </section>

      </main>
    </>
  );
}

export default Home;