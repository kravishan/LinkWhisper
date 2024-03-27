import React from "react";

const Table = ({ userData, showUserData, toggleUserData }) => {
  return (
    <div className="mt-3">
      {/* Check if userData array is not empty */}
      {userData.length > 0 && (
        <button className="btn btn-user-data mb-3" onClick={toggleUserData}>
          {showUserData ? "Hide User Data" : "View User Data"}
        </button>
      )}
      {/* Check if showUserData is true and userData is not empty */}
      {showUserData && userData.length > 0 && (
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
  );
};

export default Table;
