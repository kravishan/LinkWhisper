import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Typography, Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import "../style/login.css";

export const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [open, setOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const doSignup = async () => {
    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const response = await axios.post(
        "http://localhost:8000/api/signup",
        formData
      );

      if (response.status === 201) {
        setSuccessMessage(response.data.message);
        setOpen(true);
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/account");
        }, 2000); // Redirect after 2 seconds
      }
    } catch (error) {
      setErrorMessage(error.response.data.error || "An error occurred");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="page">
      <h2 className="mb-4 text">Create Account</h2>
      <div className="inputs">
        <TextField
          name="userName"
          value={formData.userName}
          onChange={handleInputChange}
          type="text"
          label="Username"
          variant="outlined"
          className="input"
        />
        <TextField
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          type="email"
          label="Email"
          variant="outlined"
          className="input"
        />
        <TextField
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          type="password"
          label="Password"
          variant="outlined"
          className="input"
        />
        <TextField
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          type="password"
          label="Confirm Password"
          variant="outlined"
          className="input"
        />
        <div className="button">
          <Button variant="contained" onClick={doSignup} color="primary" class="btn-txt">
            Sign Up
          </Button>
        </div>
        {errorMessage && (
          <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
              {errorMessage}
            </Alert>
          </Snackbar>
        )}
        {successMessage && (
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
              {successMessage}
            </Alert>
          </Snackbar>
        )}
      </div>
    </div>
  );
};
