import React, { useState } from "react";
import axios from "axios"; // Import axios for making HTTP requests

const Shortner = () => {
  const [inputLink, setInputLink] = useState("");
  const [shortenedLink, setShortenedLink] = useState("");
  const [clickCount, setClickCount] = useState(0);

  const handleInputChange = (event) => {
    setInputLink(event.target.value);
  };

  const handleShortenURL = async () => {
    try {
      // Send a POST request to the backend to generate the shortened URL
      const response = await axios.post("/api/shorten", { url: inputLink });
      setShortenedLink(response.data.shortenedLink);
      setClickCount(response.data.clickCount);
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
              <th>Input Link</th>
              <th>Shortened Link</th>
              <th>Click Count</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{inputLink}</td>
              <td>{shortenedLink}</td>
              <td>{clickCount}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Shortner;
