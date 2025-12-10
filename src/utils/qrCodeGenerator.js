import QRCode from 'qrcode.react';
import React from 'react';

export const QRCodeComponent = ({ value }) => <QRCode value={value} size={128} />;
