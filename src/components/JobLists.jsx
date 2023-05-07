import React, { useEffect, useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import { jobServices } from "../services/job.services";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import "../css/joblist.css";

function JobLists() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 8;
  const [imgLoading, setImgLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");

  function handleImageLoad() {
    setImgLoading(false);
  }

  useEffect(() => {
    getJobs();
  }, []);

  const getJobs = async () => {
    const data = await jobServices.getAllJobs();
    // console.log(data.docs);
    var newdata = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    // console.log(newdata);
    setJobs(newdata);
    setIsLoading(false);
  };

  const filteredJobs = jobs.filter((job) => {
    const nameMatches = job.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const salaryMatches = job.salary
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return nameMatches || salaryMatches;
  });

  const handleSearchChange = (e) => {
    // console.log(e.target.value);
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const pageCount = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);

  const displayJobs = (
    sortOrder === "newest"
      ? filteredJobs
      : filteredJobs.sort((a, b) => {
          if (sortOrder === "asc") {
            return parseInt(a.salary) - parseInt(b.salary);
          } else {
            return parseInt(b.salary) - parseInt(a.salary);
          }
        })
  )
    .slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE)
    .map((job, index) => (
      <div key={job.id} className="job-card">
        <div className={!imgLoading ? "job-image" : "loading"}>
          <img src={job.imageurl} alt={job.name} onLoad={handleImageLoad} />
        </div>
        <div className="job-details">
          <div className="job-name1">{job.name}</div>
          <div className="job-salary">SALARY: {job.salary} ₹</div>
          <div className="job-apply">
            <ApplyJob id={job.id} />
          </div>
        </div>
      </div>
    ));

  if (isLoading) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" role="status" variant="primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          name="search"
          placeholder="Search By Name Or Salary"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <select value={sortOrder} onChange={handleSort}>
          <option value="" disabled>
            Sort By
          </option>
          <option value="newest">Newest</option>
          <option value="asc">Salary: Low to High</option>
          <option value="desc">Salary: High to Low</option>
        </select>
      </div>

      {displayJobs.length > 0 ? (
        <>
          <div className="job-grid">{displayJobs}</div>
          <ReactPaginate
            pageCount={pageCount}
            onPageChange={handlePageChange}
            containerClassName="pagination"
            pageLinkClassName="page-link"
            previousLinkClassName="page-link"
            nextLinkClassName="page-link"
            pageClassName="page-item"
            previousClassName="page-item"
            nextClassName="page-item"
            activeClassName="active"
            disabledClassName="disabled"
          />
        </>
      ) : (
        <div className="not-found">Not Found</div>
      )}
    </div>
  );
}

function ApplyJob({ id }) {
  const navigate = useNavigate();
  const handleApply = () => {
    navigate("/jobdetails", { state: id });
  };
  return (
    <button className="button-85" onClick={handleApply}>
      Apply
    </button>
  );
}

export default JobLists;
