import React, { useState } from "react";
import { jobServices } from "../services/job.services";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase-config";
import { v4 } from "uuid";
import { Spinner } from "react-bootstrap";
import "../css/addJob.css";

function AddJob() {
  const [job, setJob] = useState({
    imageurl: "",
    name: "",
    salary: "",
    experience: "",
    dailyhours: "",
    place: "",
    contact: "",
    timestamp: "",
    mobile: "",
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //image upload
  const [imageUpload, setImageUpload] = useState(null);

  const uploadFile = async () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    const snapshot = await uploadBytes(imageRef, imageUpload);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    console.log(job);
    await addJob(job);
    event.target.reset();
  };

  const addJob = async (job) => {
    const timestampOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
      timeZone: "Asia/Kolkata",
    };

    const imageUrl = await uploadFile();

    job.timestamp = new Date().toLocaleString("en-US", timestampOptions);
    job.imageurl = imageUrl;

    await jobServices.addJob(job);

    setJob({
      imageurl: "",
      name: "",
      salary: "",
      experience: "",
      dailyhours: "",
      place: "",
      contact: "",
      timestamp: "",
      mobile: "",
    });

    setIsLoading(false);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 4000);
  };

  const handleInputChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    setJob((prevJob) => ({
      ...prevJob,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setImageUpload(null);
      return;
    }

    // Check if file type is jpeg, jpg or png
    const fileType = file.type;
    if (
      fileType !== "image/jpeg" &&
      fileType !== "image/jpg" &&
      fileType !== "image/png"
    ) {
      alert("Please upload a jpeg, jpg, or png file.");
      setImageUpload(null);
      event.target.value = null;
      return;
    }

    setImageUpload(file);
  };

  // if (isLoading) {
  //   return <Spinner animation="border" role="status" />;
  // }
  return (
    <div>
      <h1 className="addjob-heading">Add Job</h1>
      {isLoading && (
        <div className="spinner-overlay">
          <Spinner animation="border" role="status" variant="primary" />
        </div>
      )}
      {showSuccessMessage && <div className="msg">Job added successfully!</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={job.name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Salary:
          <input
            type="number"
            name="salary"
            value={job.salary}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Experience(in years):
          <input
            type="number"
            name="experience"
            value={job.experience}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Daily Hours:
          <input
            type="text"
            name="dailyhours"
            value={job.dailyhours}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Location:
          <input
            type="text"
            name="place"
            value={job.place}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Email Contact:
          <input
            type="email"
            name="contact"
            value={job.contact}
            onChange={handleInputChange}
          />
        </label>
        <div className="input-container">
          <label>
            Mobile Contact:
            <input
              type="text"
              name="mobile"
              value={job.mobile}
              onChange={handleInputChange}
              maxLength={10}
              minLength={10}
            />
          </label>
        </div>
        <label>
          Job Picture:
          <input
            type="file"
            onClick={(event) => {
              event.target.value = null;
              setImageUpload(null);
            }}
            onChange={handleFileChange}
            required
          />
        </label>
        {imageUpload && (
          <div>
            <img
              src={URL.createObjectURL(imageUpload)}
              alt="Selected"
              width={100}
              height={100}
            />
          </div>
        )}
        <div className="button-container">
          <button type="submit">Add Job</button>
        </div>
      </form>
    </div>
  );
}

export default AddJob;
