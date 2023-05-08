import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { jobServices } from "../services/job.services";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { storage } from "../firebase-config";
import { ref, deleteObject } from "firebase/storage";
import "../css/joblist.css";

function JobLists() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 8;
  const [imgLoading, setImgLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");
  const [isDeleted, setIsDeleted] = useState(false);
  const [mode, setMode] = useState("view");
  const adminEmail = "harsh.jolapara110578@marwadiuniversity.ac.in";

  const handleSliderChange = () => {
    const newMode = mode === "view" ? "edit" : "view";
    setMode(newMode);
    // onModeChange(newMode);
  };

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

  const handleSort = (event) => {
    const selectedValue = event.target.value;
    setSortOrder(selectedValue);
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
          {localStorage.getItem("email") === adminEmail && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                margin: "1rem 0",
              }}
            >
              <UpdateButton job={job} />
              <div style={{ margin: "0 0.5rem" }}></div>
              <DeleteJob
                id={job.id}
                setIsDeleted={setIsDeleted}
                setIsLoading={setIsLoading}
                imageurl={job.imageurl}
              />
            </div>
          )}
        </div>
      </div>
    ));

  const displayJobs1 = (
    sortOrder === "newest"
      ? filteredJobs
      : filteredJobs.sort((a, b) => {
          if (sortOrder === "asc") {
            return parseInt(a.salary) - parseInt(b.salary);
          } else {
            return parseInt(b.salary) - parseInt(a.salary);
          }
        })
  ).slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" role="status" variant="primary" />
      </div>
    );
  }

  return (
    <div className="main-div">
      <div className="search-container2">
        <input
          type="text"
          name="search"
          placeholder="Search By Name Or Salary"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input2"
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
      {localStorage.getItem("email") === adminEmail && (
        <div className="flex-container-slidebar">
          <span style={{ marginRight: "0.5rem" }}>View Mode</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={mode === "edit"}
              onChange={handleSliderChange}
            />
            <span className="slider round"></span>
          </label>
          <span style={{ marginLeft: "0.5rem" }}>Table Mode</span>
        </div>
      )}

      {displayJobs.length > 0 ? (
        <>
          {mode === "view" ? (
            <div className="job-grid">{displayJobs}</div>
          ) : (
            <div className="table-container">
              <table className="job-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Salary</th>
                    <th>Experience</th>
                    <th>Daily Hours</th>
                    <th>Location</th>
                    <th>Mobile</th>
                    <th>Contact</th>
                    <th colSpan={2}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayJobs1.map((job, index) => (
                    <tr key={job.id}>
                      <td className={!imgLoading ? "job-image1" : "loading"}>
                        <img
                          src={job.imageurl}
                          alt={job.name}
                          onLoad={handleImageLoad}
                        />
                      </td>
                      <td>{job.name}</td>
                      <td>{job.salary} ₹</td>
                      <td>{job.experience}</td>
                      <td>{job.dailyhours}</td>
                      <td>{job.place}</td>
                      <td>{job.mobile}</td>
                      <td>{job.contact}</td>
                      <td>
                        <UpdateButton1 job={job} />
                      </td>
                      <td>
                        <DeleteJob
                          id={job.id}
                          setIsDeleted={setIsDeleted}
                          imageurl={job.imageurl}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

function DeleteJob({ id, setIsDeleted, imageurl, setIsLoading }) {
  const handleDelete = () => {
    //image delete
    const imageRef = ref(storage, imageurl);
    // Delete the file
    deleteObject(imageRef)
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });

    //job delete
    jobServices.deleteJob(id).then(() => {
      setIsDeleted(true);
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsDeleted(false);
        window.location.reload();
      }, 1700);
    });
  };

  return (
    <button className="delete-button-list" onClick={handleDelete}>
      Delete
    </button>
  );
}

function UpdateButton({ job }) {
  const navigate = useNavigate();
  const handleUpdate = () => {
    // console.log(job);
    navigate("/updatejob", { state: job });
  };
  return (
    <button className="update-button-list" onClick={handleUpdate}>
      Update
    </button>
  );
}

function UpdateButton1({ job }) {
  const navigate = useNavigate();
  const handleUpdate = () => {
    // console.log(job);
    navigate("/updatejob", { state: job });
  };
  return (
    <button className="update" onClick={handleUpdate}>
      Update
    </button>
  );
}

export default JobLists;
