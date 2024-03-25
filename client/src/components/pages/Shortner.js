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
      const response = await axios.post("http://localhost:8000/api/shorten", { originalUrl: inputLink, email: user.name });
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
      <div className="mt-5">
        <h3>User Data</h3>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Original URL</th>
              <th>Shortened URL</th>
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
            </tr>
          ))}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Shortner;
