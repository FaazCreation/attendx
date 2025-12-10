import React, { useEffect, useState } from 'react';
import { getAllSessions, submitAttendance } from '../../firebase/firestore';
import { QRCodeComponent } from '../../utils/qrCodeGenerator';
import { auth } from '../../firebase/config';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [codeInput, setCodeInput] = useState({});
  
  useEffect(() => {
    const fetchSessions = async () => {
      const data = await getAllSessions();
      setSessions(data);
    };
    fetchSessions();
  }, []);

  const handleAttend = async (sessionId, sessionCode) => {
    if (codeInput[sessionId] !== sessionCode) {
      alert('Invalid code!');
      return;
    }
    try {
      await submitAttendance(sessionId, auth.currentUser.uid);
      alert('Attendance submitted!');
    } catch (err) {
      alert('You have already submitted attendance or error occurred.');
    }
  };

  return (
    <div>
      <h2>Available Sessions</h2>
      {sessions.map(session => (
        <div key={session.id} style={{ border: '1px solid gray', padding: '10px', margin: '10px' }}>
          <h3>{session.title}</h3>
          <p>Type: {session.type}</p>
          <p>Date: {new Date(session.date).toLocaleString()}</p>
          <QRCodeComponent value={session.attendanceCode} />
          <input
            placeholder="Enter attendance code"
            value={codeInput[session.id] || ''}
            onChange={e => setCodeInput({ ...codeInput, [session.id]: e.target.value })}
          />
          <button onClick={() => handleAttend(session.id, session.attendanceCode)}>Attend</button>
        </div>
      ))}
    </div>
  );
};

export default Sessions;
