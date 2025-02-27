import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginSuccess } from "../features/authSlice";
import { fetchUserProfileSuccess } from "../features/userSlice";
import ForgotPasswordForm from "./ForgotPasswordForm";

const Login = () => {
  const { profile, isLoading } = useSelector((state) => state.user);
  const { token, user } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sumbitFormHandler = () => {
    setIsModalOpen((prev) => !prev);
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      console.log(process.env.REACT_APP_SOCIAL_BACKEND_API)
      const response = await axios.post(
         `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/auth/login`,
        // `http://localhost:8080/api/auth/login`,

        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          // withCredentials: true,
        }
      );
      // console.log(response);
      // console.log(document.cookie);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.details));

      document.cookie = `token=${response.data.token}; path=/`;
      dispatch(
        loginSuccess({
          details: response.data.details,
          token: response.data.token,
        })
      );
      console.log("details:", response.data.details);

      dispatch(fetchUserProfileSuccess(response.data.details));
      setSuccess(response.data.message);

      setError("");
      setTimeout(() => {
        navigate("/home");
      }, 1200);
    } catch (error) {
      setLoading(false);
      setError(
        error.response?.data?.error || "Login failed. Please try again!"
      );
    }
  };

  return (
    <>
  <div className="container-form my-3">
      <h1 className=" mb-4 fw-bolder display-4 text-center">
        <Link to="/" className="link-underline link-underline-opacity-0">
          <span className="primaryTextClr">My </span>
          <span className="text-black">Website</span>
        </Link>
      </h1>

      <div className="login-form">
        <h3 className="text-center display-6 fw-semibold mb-3">Login</h3>
        {success && <p className="text-success">{success}</p>}
        {error && <p className="text-danger">{error}</p>}

        <form className="" onSubmit={formSubmitHandler}>
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
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="d-flex justify-content-between mt-4">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" />
              <label className="form-check-label">Remember Me</label>
            </div>
            <p className="text-primary fw-semibold" 
               onClick={sumbitFormHandler} 
               style={{cursor: "pointer"}}>
              Forgot your password?
            </p>
          </div>
          <button type="submit" className="loginBtn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <Link
          to="/signup"
          className="text-center mt-3 fs-5 text-decoration-none text-dark"
          style={{ display: "block" }}
        >
          Create New Account &rarr;{" "}
        </Link>
      </div>
    </div>
    
     {isModalOpen && (
      <div
        className="modal show d-block"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" 
            >
            <div className="modal-header" 
              style={{backgroundColor: "rgba(179, 176, 176, 0.5)"}}
              >
              <h5 className="modal-title">Change Password</h5>
              <button
                type="button"
                className="btn-close"
                onClick={sumbitFormHandler}
              ></button>
            </div>
            <div className="modal-body " 
               style={{backgroundColor: "rgba(232, 223, 223, 0.5)"}}>
              <ForgotPasswordForm userDetail={profile?.user} />
            </div>
          </div>
        </div>
      </div>
    )}    
    </>
  
  );
};

export default Login;
