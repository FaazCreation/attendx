import React, { useState } from 'react';
import { createSession } from '../../firebase/firestore';
import { generateCode } from '../../utils/generateCode';
import { QRCodeComponent } from '../../utils/qrCodeGenerator';

const CreateSession = () => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('General Meeting');
  const [date, setDate] = useState('');
  const [attendanceCode, setAttendanceCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = generateCode();
    setAttendanceCode(code);
    await createSession({ title, type, date, attendanceCode: code, createdBy: 'admin' });
    alert('Session Created! Code: ' + code);
  };

  return (
    <div>
      <h2>Create Session</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <select value={type} onChange={e => setType(e.target.value)}>
          <option>General Meeting</option>
          <option>Monthly Meeting</option>
          <option>Annual Meeting</option>
          <option>Workshop</option>
          <option>Event</option>
          <option>Photowalk</option>
        </select>
        <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required />
        <button type="submit">Create Session</button>
      </form>
      {attendanceCode && (
        <div>
          <p>Attendance Code: {attendanceCode}</p>
          <QRCodeComponent value={attendanceCode} />
        </div>
      )}
    </div>
  );
};

export default CreateSession;
