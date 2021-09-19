import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./Signin-up.css";
import axios from 'axios'

function Signup() {

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [username, setUsername] = useState();
  const [error, setError] = useState("");

  const history = useHistory();

  const API_URL = process.env.REACT_APP_API_URL

  console.log(API_URL)

  const handleForm = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const data = new FormData();
    data.append("username", username);
    data.append("email", email);
    data.append("password", password);

    try {
      await axios.post(API_URL + "api/auth/signup", data, config);
      history.push("/survey");
    } catch (err) {
      console.log(err);
      setError("Username Already Exist")
    }
  };


  return (
    <div className="signup-container">
      <div className="signup-card">
        <form onSubmit={handleForm}>
          <h2 className="signup-title"> Register </h2>
          <p className="line"></p>
          <div className="error-message"><p>{error}</p></div>
          <div className="signup-fields">
            <label htmlFor="username"> {" "} <b>Username</b></label>
            <input className="signup-textbox" type="text" placeholder="Enter Username" name="username" required onChange={(e) => { setUsername(e.target.value); }} />
            <label htmlFor="email">{" "}<b>Email</b></label>
            <input className="signup-textbox" type="email" placeholder="Enter Email" name="email" required onChange={(e) => { setEmail(e.target.value); }} />
            <label htmlFor="password"> <b>Password</b></label>
            <input className="signup-textbox" type="password" placeholder="Enter Password" minLength="6" name="psw" required onChange={(e) => { setPassword(e.target.value); }} />
          </div>
          <button className="signup-button" >Sign Up</button>
        </form>
        <div className="signup-option">
          <p className="signup-question">
            Have an account? <Link to="/signin">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
