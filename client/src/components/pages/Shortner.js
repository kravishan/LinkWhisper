import React, { useState } from "react";
import axios from "axios";
import { FiCopy } from 'react-icons/fi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons'; // Import the cog icon
import { faLink } from '@fortawesome/free-solid-svg-icons'; // Import the faLink icon
import { AuthData } from "../../auth/AuthWrapper";
import '../style/shortner.css';


const Shortner = () => {
  const { user } = AuthData();
  const [inputLink, setInputLink] = useState("");
  const [shortenedLink, setShortenedLink] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [loading, setLoading] = useState(false);
  // const [showUserData, setShowUserData] = useState(false); // State variable to toggle table visibility
  const [startDate, setStartDate] = useState(""); // State variable for start date
  const [expirationDate, setExpirationDate] = useState(""); // State variable for expiration date
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false); // State variable to toggle advanced settings visibility
  const [requireSignIn, setRequireSignIn] = useState(false);
  const [sharedEmails, setSharedEmails] = useState([]);

  

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

  // const toggleUserData = () => {
  //   setShowUserData(!showUserData);
  // };

  const toggleAdvancedSettings = () => {
    setShowAdvancedSettings(!showAdvancedSettings);
  };

  return (
    <div className="container mt-5" style={{ position: 'relative' }}>
      <h2 className="mb-4 text">URL Shortener</h2>
      <div className="url-box" style={{ position: 'relative' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Enter URL"
          value={inputLink}
          onChange={handleInputChange}
        />
        <button className="btn btn-settings" onClick={toggleAdvancedSettings} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}>
          <FontAwesomeIcon icon={faCog} className="mr-2" />
          {showAdvancedSettings ? "" : ""}
        </button>
      </div>
      
      <div className="input-group mt-3">
        <div className="input-group-append">
          <button
            className="btn-shorten"
            type="button"
            onClick={handleShortenURL}
            disabled={loading || !inputLink.trim()}
          >
            {loading ? "Shortening..." : (
        <>
          <FontAwesomeIcon icon={faLink} className="mr-2" /> 
          Shorten
        </>
      )}
    </button>
        </div>
      </div>



      {shortenedLink && (
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title text">Original URL:</h5>
            <p className="card-text">
              <a
                href={originalUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {originalUrl}
              </a>
            </p>
            <h5 className="card-title text">Shortened URL:</h5>
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
        {showAdvancedSettings && (
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Start Date:</label>
                <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Expiration Date:</label>
                <input type="date" className="form-control" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-check" style={{ fontSize: '1.1rem', padding: '2.5rem' }}>
                <input type="checkbox" className="form-check-input" id="requireSignIn" onChange={(e) => setRequireSignIn(e.target.checked)} />
                <label className="form-check-label" htmlFor="requireSignIn">Require Sign In to Access</label>
              </div>
            </div>
            <div className="col-md-6">
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
          </div>
        )}
      </div>



      
    </div>
  );
};

export default Shortner;
