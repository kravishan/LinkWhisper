import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import './style/account.css';

const MAX_URL_LENGTH = 30; // Maximum number of characters to display for the original URL

const truncateUrl = (url) => {
  return url.length > MAX_URL_LENGTH ? url.slice(0, MAX_URL_LENGTH) + '...' : url;
};

const UserDataTable = ({ userData }) => {
  return (
    <div>
      <h3 className="table-header">Your All History Records</h3>
      <TableContainer component={Paper} className="custom-table-container">
        <Table aria-label="user data table" className="custom-table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Shortened URL</TableCell>
              <TableCell>Open Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.map((data, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <a href={data.originalUrl} target="_blank" rel="noopener noreferrer">
                    {truncateUrl(data.originalUrl)}
                  </a>
                </TableCell>
                <TableCell>
                  <a href={`http://localhost:8000/${data.shortUrl}`} target="_blank" rel="noopener noreferrer">
                    {`http://localhost:8000/${data.shortUrl}`}
                  </a>
                </TableCell>
                <TableCell>{data.openCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserDataTable;
