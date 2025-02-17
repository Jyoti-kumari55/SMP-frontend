import React, { useState } from "react";
import axios from "axios";

const ForgotPasswordForm = ({ userDetail }) => {
  const [email, setEmail] = useState(userDetail?.email || "");
  // const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateEmail = async () => {
    try {
      const response = await axios.get(
         `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/auth/validate-email?email=${email}`
      );
      return response.data.exists; 
    } catch (error) {
      return false;
    }
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    if (!email) {
      setEmailError("Please enter your email.");
      return;
    }

    const isEmailValid = await validateEmail();
    if (!isEmailValid) {
      setEmailError("Email not found.");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SOCIAL_BACKEND_API}/api/auth/reset-password`,
        { email, newPassword }
      );
      setSuccess("Password updated successfully.");
       setEmail("");
      //  setCurrentPassword("");
       setNewPassword("");
    } catch (error) {
      setError(error.response?.data?.error || "Failed to update the password.");
    }
  };

  return (
    <div>
      <form onSubmit={formSubmitHandler}>
        <label htmlFor="email" className="form-label">
          <b>Email</b>
        </label>

        <input
          type="email"
          className="form-control mb-4"
          value={email}
          placeholder="your email"
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
        />

        {emailError && <p className="text-danger">{emailError}</p>}
{/* 
        <label htmlFor="currentPassword" className="form-label">
          <b>Old Password</b>
        </label>

        <input
          type="password"
          className="form-control mb-4"
          placeholder="old password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        /> */}

        <label htmlFor="username" className="form-label">
          <b>New Password</b>
        </label>
        <input
          type="password"
          className="form-control mb-4"
          placeholder="new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        {error && <p className="text-danger">{error}</p>}
        {success && <p className="text-success">{success}</p>}

        <button type="submit" className="btn btn-primary float-end">
          Save Password
        </button>
      </form>
    </div>
  );
};


export default ForgotPasswordForm;
