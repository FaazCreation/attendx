import React from 'react';
import { useNavigate } from 'react-router-dom';

const MemberDashboard = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h2>Member Dashboard</h2>
      <button onClick={() => navigate('/sessions')}>View Sessions</button>
    </div>
  );
};

export default MemberDashboard;
