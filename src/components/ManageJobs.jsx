import React, { useEffect, useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import { jobServices } from "../services/job.services";
import ReactPaginate from "react-paginate";
import "../css/manageJobs.css";
import { storage } from "../firebase-config";
import { ref, deleteObject } from "firebase/storage";
import { useNavigate } from "react-router-dom";

function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 10;
  const [imgLoading, setImgLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");
  const [isDeleted, setIsDeleted] = useState(false);

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
  ).slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" role="status" variant="primary" />
      </div>
    );
  }

  return (
    <>
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
      {isDeleted && (
        <div className="delete-message">Job successfully deleted!</div>
      )}
      {displayJobs.length > 0 ? (
        <>
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
              {displayJobs.map((job, index) => (
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
                    <UpdateButton job={job} />
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
    </>
  );
}

function DeleteJob({ id, setIsDeleted, imageurl }) {
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
      setTimeout(() => {
        setIsDeleted(false);
        window.location.reload();
      }, 1700);
    });
  };

  return (
    <button className="btn btn-danger" onClick={handleDelete}>
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
    <button className="update" onClick={handleUpdate}>
      Update
    </button>
  );
}

export default ManageJobs;
