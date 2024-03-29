import React from 'react';
import QRCode from 'react-qr-code';

const QRCodeComponent = ({ url }) => {
  return (
    <div>
      <h5>QR Code:</h5>
      <QRCode value={url} />
    </div>
  );
};

export default QRCodeComponent;
