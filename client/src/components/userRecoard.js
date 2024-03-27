import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import './style/account.css';

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
                    {data.originalUrl}
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
