function JobFilters({
  search,
  setSearch,
  location,
  setLocation,
  jobType,
  setJobType,
  experience,
  setExperience,
}) {
  return (
    <div className="job-filters">

      <div className="search-box">

        <span>🔍</span>

        <input
          type="text"
          placeholder="Search jobs, skills or companies..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

      </div>


      <div className="filter-group">

        <select
          value={location}
          onChange={(event) =>
            setLocation(event.target.value)
          }
        >
          <option value="">All Locations</option>
          <option value="Chennai">Chennai</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
          <option value="Coimbatore">Coimbatore</option>
        </select>


        <select
          value={jobType}
          onChange={(event) =>
            setJobType(event.target.value)
          }
        >
          <option value="">All Job Types</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="Internship">Internship</option>
          <option value="Remote">Remote</option>
        </select>


        <select
          value={experience}
          onChange={(event) =>
            setExperience(event.target.value)
          }
        >
          <option value="">Experience</option>
          <option value="Fresher">Fresher</option>
          <option value="1-2 Years">1-2 Years</option>
          <option value="2-4 Years">2-4 Years</option>
          <option value="4+ Years">4+ Years</option>
        </select>

      </div>

    </div>
  );
}

export default JobFilters;