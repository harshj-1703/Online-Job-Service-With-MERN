import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { jobServices } from "../services/job.services";
import { Spinner } from "react-bootstrap";
import "../css/jobDetails.css";

function JobDetails() {
  const location = useLocation();
  const jobId = location.state;
  const [job, setJob] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imgLoading, setImgLoading] = useState(true);

  function handleImageLoad() {
    setImgLoading(false);
  }

  const handleContactClick = () => {
    window.location.href = "mailto:" + job.contact;
  };

  const handleContactClickMobile = () => {
    window.location.href = "tel:" + job.mobile;
  };

  useEffect(() => {
    getJob();
  }, []);

  const getJob = async () => {
    const docSnapshot = await jobServices.getJobById(jobId);
    const jobData = docSnapshot.data();
    // console.log(jobData);
    setJob(jobData);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" role="status" variant="primary" />
      </div>
    );
  } else {
    return (
      <>
        <div class="container">
          <div class={`image${imgLoading ? " loading" : ""}`}>
            <img src={job.imageurl} alt={job.name} onLoad={handleImageLoad} />
          </div>
          <div class="details">
            <div class="job-name">{job.name}</div>
            <div class="job-info">
              <div class="info-row">
                <div class="info-label">Salary:</div>
                <div class="info-value">{job.salary}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Experience:</div>
                <div class="info-value">{job.experience}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Daily hours:</div>
                <div class="info-value">{job.dailyhours}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Location:</div>
                <div class="info-value">{job.place}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Email:</div>
                <div class="info-value">{job.contact}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Mobile:</div>
                <div class="info-value">{job.mobile}</div>
              </div>
            </div>
            <div class="buttons">
              <button onClick={handleContactClick}>Contact With Email</button>
              <button onClick={handleContactClickMobile}>
                Contact With Mobile
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default JobDetails;
