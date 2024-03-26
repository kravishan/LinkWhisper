import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const doSignup = async () => {
    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const response = await axios.post("http://localhost:8000/api/signup", formData);
      
      if (response.status === 201) {
        setSuccessMessage(response.data.message);
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/account");
        }, 1000); // Redirect after 2 seconds
      }
    } catch (error) {
      setErrorMessage(error.response.data.error || "An error occurred");
    }
  };

  return (
    <div className="page">
      <h2>Signup page</h2>
      <div className="inputs">
        <div className="input">
          <input
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
            type="text"
            placeholder="Username"
          />
        </div>
        <div className="input">
          <input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            type="email"
            placeholder="Email"
          />
        </div>
        <div className="input">
          <input
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            type="password"
            placeholder="Password"
          />
        </div>
        <div className="input">
          <input
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            type="password"
            placeholder="Confirm Password"
          />
        </div>
        <div className="button">
          <button onClick={doSignup}>Sign Up</button>
        </div>
        {errorMessage && <div className="error">{errorMessage}</div>}
        {successMessage && <div className="success">{successMessage}</div>}
      </div>
    </div>
  );
};
