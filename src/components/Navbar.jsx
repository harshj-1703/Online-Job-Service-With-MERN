import React from "react";
import { Link } from "react-router-dom";
import "../css/navbar.css";
import myImage from "../assets/images/1.jpg";
import { signInWithGoogle, auth } from "../firebase-config";

const email = "harsh.jolapara110578@marwadiuniversity.ac.in";

function handleSignOut() {
  auth
    .signOut()
    .then(() => {
      localStorage.clear();
      window.location.href = "/";
    })
    .catch((error) => {
      console.log(error.message);
    });
}

function Navbar() {
  return (
    <nav className="navbar">
      {localStorage.getItem("displayName") && (
        <div className="user-info">
          <h1>{localStorage.getItem("displayName")}</h1>
          <img src={localStorage.getItem("profilePic")} />
        </div>
      )}
      {!localStorage.getItem("displayName") && (
        <button className="login-with-google-btn" onClick={signInWithGoogle}>
          Sign in with Google
        </button>
      )}
      <div className="heading">
        <div className="logo">
          <img src={myImage} alt="Online Job Portal" />
        </div>
        <h4>Online Job Portal</h4>
      </div>
      <div className="menu">
        <ul>
          <li>
            <Link to="/" className="active">
              Home
            </Link>
          </li>
          {localStorage.getItem("email") == email && (
            <>
              <li>
                <Link to="/add">Add Job</Link>
              </li>
              <li>
                <Link to="/managejobs">Manage Job</Link>
              </li>
            </>
          )}
          {localStorage.getItem("displayName") && (
            <li>
              <Link onClick={handleSignOut} className="signout">
                SignOut
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
