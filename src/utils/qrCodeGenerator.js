import React from 'react';
import QRCode from 'react-qr-code';

export const QRCodeComponent = ({ value }) => (
  <QRCode value={value} size={128} />
);
