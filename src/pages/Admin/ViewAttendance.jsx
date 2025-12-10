import React, { useEffect, useState } from 'react';
import { getAllSessions, getAttendanceBySession } from '../../firebase/firestore';
import { exportAttendancePDF } from '../../utils/exportPDF';

const ViewAttendance = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [attendanceList, setAttendanceList] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      const data = await getAllSessions();
      setSessions(data);
    };
    fetchSessions();
  }, []);

  const handleSelectSession = async (e) => {
    const sessionId = e.target.value;
    setSelectedSession(sessionId);
    if (sessionId) {
      const attendance = await getAttendanceBySession(sessionId);
      setAttendanceList(attendance);
    } else {
      setAttendanceList([]);
    }
  };

  return (
    <div>
      <h2>View Attendance</h2>
      <select onChange={handleSelectSession} value={selectedSession}>
        <option value="">Select Session</option>
        {sessions.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
      </select>

      {attendanceList.length > 0 && (
        <div>
          <h3>Attendance List</h3>
          <ul>
            {attendanceList.map((a, i) => <li key={i}>{a.userId}</li>)}
          </ul>
          <button onClick={() => exportAttendancePDF(sessions.find(s => s.id === selectedSession).title, attendanceList)}>Export PDF</button>
        </div>
      )}
    </div>
  );
};

export default ViewAttendance;
