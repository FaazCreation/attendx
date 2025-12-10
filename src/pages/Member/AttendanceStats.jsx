import React, { useEffect, useState } from 'react';
import { getAllSessions, getAttendanceBySession } from '../../firebase/firestore';
import { auth } from '../../firebase/config';

const AttendanceStats = () => {
  const [stats, setStats] = useState({ total: 0, attended: 0, percentage: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const sessions = await getAllSessions();
      let attendedCount = 0;
      for (let s of sessions) {
        const attendance = await getAttendanceBySession(s.id);
        if (attendance.find(a => a.userId === auth.currentUser.uid)) attendedCount++;
      }
      setStats({ total: sessions.length, attended: attendedCount, percentage: sessions.length ? (attendedCount / sessions.length * 100).toFixed(2) : 0 });
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2>Your Attendance Stats</h2>
      <p>Total Sessions: {stats.total}</p>
      <p>Attended: {stats.attended}</p>
      <p>Attendance Percentage: {stats.percentage}%</p>
    </div>
  );
};

export default AttendanceStats;
