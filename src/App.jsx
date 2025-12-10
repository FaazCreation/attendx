import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AdminDashboard from './pages/Admin/Dashboard';
import MemberDashboard from './pages/Member/Dashboard';
import Sessions from './pages/Member/Sessions';
import ViewAttendance from './pages/Admin/ViewAttendance';
import NotFound from './pages/NotFound';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, role } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? (role === 'admin' ? <AdminDashboard /> : <MemberDashboard />) : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/sessions" element={user && role === 'member' ? <Sessions /> : <Navigate to="/login" />} />
      <Route path="/view-attendance" element={user && role === 'admin' ? <ViewAttendance /> : <Navigate to="/login" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
