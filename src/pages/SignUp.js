import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [terms, setTerms] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState("");
  

  const navigate = useNavigate();

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPass) {
      setError("Password do not match");
      return;
    }

    if (!terms) {
      setError("You must accept the terms and conditions.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/auth/register`,
        {
          name,
          username,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response)
      setSuccess(response.data.message);
      setError("");
      
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error("Error during registration: ", error);
      setLoading(false);
      setError(
        error.response?.data?.error || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="container-form my-4">
      <h1 className=" mb-4 fw-bolder display-4 text-center">
        <Link to="/" className="link-underline link-underline-opacity-0">
          <span className="primaryTextClr">My </span>
          <span className="text-black">Website</span>
        </Link>
      </h1>

      <div className="login-form ">
        <h3 className="text-center display-6 fw-semibold mb-3">SignUp</h3>
        {error && <p className="text-danger">{error}</p>}
        {success && <p className="text-success">{success}</p>}
        <form className="" onSubmit={formSubmitHandler}>
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Your Full Name"
            className="form-control mb-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            placeholder="Your username"
            className="form-control mb-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Your Email Id"
            className="form-control mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            placeholder="Your Password"
            className="form-control mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label htmlFor="password" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm Your Password"
            className="form-control mb-4"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            required
          />

          <div className="form-check mb-4">
            <input
              type="checkbox"
              className="form-check-input"
              checked={terms}
              onChange={() => setTerms(!terms)}
            />
            <label className="form-check-label">
              I accept all Terms & Conditions.
            </label>
          </div>
        
          <button type="submit" className="loginBtn" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
          {/* <button type="submit">Create New Account</button> */}
        </form>
        <Link
          to="/login"
          className="text-center mt-3 fs-5 text-decoration-none text-dark"
          style={{ display: "block" }}
        >
          Already have an account &rarr;{" "}
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
