import React, { useState } from "react";
import axios from "axios";

const Shortner = () => {
  const [inputLink, setInputLink] = useState("");
  const [shortenedLink, setShortenedLink] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");

  const handleInputChange = (event) => {
    setInputLink(event.target.value);
  };

  const handleShortenURL = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/shorten", { Originalurl: inputLink });
      setOriginalUrl(response.data.originalUrl); // Set the original URL from the backend response
      setShortenedLink(response.data.shortUrl); // Set the shortened URL from the backend response
    } catch (error) {
      console.error("Error shortening URL:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>URL Shortener</h2>
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
          >
            Shorten
          </button>
        </div>
      </div>
      {shortenedLink && (
        <table className="table">
          <thead>
            <tr>
              <th>Original URL</th>
              <th>Shortened URL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{originalUrl}</td>
              <td>{shortenedLink}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Shortner;
