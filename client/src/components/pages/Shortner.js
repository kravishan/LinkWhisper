import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiCopy } from 'react-icons/fi';
import { AuthData } from "../../auth/AuthWrapper";

const Shortner = () => {
  const { user } = AuthData();
  const [inputLink, setInputLink] = useState("");
  const [shortenedLink, setShortenedLink] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const [showUserData, setShowUserData] = useState(false); // State variable to toggle table visibility
  const [startDate, setStartDate] = useState(""); // State variable for start date
  const [expirationDate, setExpirationDate] = useState(""); // State variable for expiration date
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false); // State variable to toggle advanced settings visibility
  const [requireSignIn, setRequireSignIn] = useState(false);
  const [sharedEmails, setSharedEmails] = useState([]);


  useEffect(() => {
    fetchUserData(user.name);
  }, []);

  const fetchUserData = async (userEmail) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/userData/${userEmail}`);
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleInputChange = (event) => {
    setInputLink(event.target.value);
  };

  const handleShortenURL = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/shorten", { originalUrl: inputLink, email: user.name, startDate, expirationDate, requireSignIn, sharedEmails});
      setOriginalUrl(response.data.originalUrl);
      setShortenedLink(response.data.shortUrl);
    } catch (error) {
      console.error("Error shortening URL:", error);
    }
    setLoading(false);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(`http://localhost:8000/${shortenedLink}`);
  };

  const toggleUserData = () => {
    setShowUserData(!showUserData);
  };

  const toggleAdvancedSettings = () => {
    setShowAdvancedSettings(!showAdvancedSettings);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">URL Shortener</h2>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter URL"
          value={inputLink}
          onChange={handleInputChange}
        />
        <div className="input-group-append">
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleShortenURL}
            disabled={loading || !inputLink.trim()}
          >
            {loading ? "Shortening..." : "Shorten"}
          </button>
        </div>
      </div>
      {shortenedLink && (
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Original URL:</h5>
            <p className="card-text">
              <a
                href={originalUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {originalUrl}
              </a>
            </p>
            <h5 className="card-title">Shortened URL:</h5>
            <p className="card-text">
              <a
                href={`http://localhost:8000/${shortenedLink}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {`http://localhost:8000/${shortenedLink}`}
              </a>
              <FiCopy onClick={handleCopyToClipboard} style={{ cursor: "pointer", fontSize: "1.5em", marginLeft: "5px", color: "#007bff" }} />
            </p>
          </div>
        </div>
      )}
      
      
      <div className="mt-3">
        <button className="btn btn-primary mb-3" onClick={toggleAdvancedSettings}>
          {showAdvancedSettings ? "Hide Advanced Settings" : "Advanced Settings"}
        </button>
        {showAdvancedSettings && (
          <div>
            <div className="form-group">
              <label>Start Date:</label>
              <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Expiration Date:</label>
              <input type="date" className="form-control" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} />
            </div>

            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="requireSignIn" onChange={(e) => setRequireSignIn(e.target.checked)} />
              <label className="form-check-label" htmlFor="requireSignIn">Require Sign In to Access</label>
            </div> 

            <div className="form-group">
              <label htmlFor="shareWithEmail">Share with:</label>
              <input
                type="text"
                className="form-control"
                id="shareWithEmail"
                placeholder="Enter email addresses separated by commas"
                onChange={(e) => {
                  const emails = e.target.value.split(',').map(email => email.trim());
                  setSharedEmails(emails);
                }}
              />
            </div>
        
          </div>
        )}
      </div>



      <div className="mt-3">
        <button className="btn btn-primary mb-3" onClick={toggleUserData}>
          {showUserData ? "Hide User Data" : "View User Data"}
        </button>
        {showUserData && (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Original URL</th>
                <th>Shortened URL</th>
                <th>Open Count</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((data, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <a href={data.originalUrl} target="_blank" rel="noopener noreferrer">
                      {data.originalUrl}
                    </a>
                  </td>
                  <td>
                    <a href={`http://localhost:8000/${data.shortUrl}`} target="_blank" rel="noopener noreferrer">
                      {`http://localhost:8000/${data.shortUrl}`}
                    </a>
                  </td>
                  <td>{data.openCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Shortner;
