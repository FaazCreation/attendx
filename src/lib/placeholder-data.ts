import type { User, Session, AttendanceRecord } from './types';

export const mockUsers: User[] = [
  { id: 'usr_001', name: 'Admin User', email: 'admin@tcpc.com', role: 'Admin', department: 'CSE', batch: '2020', avatarUrl: 'https://picsum.photos/seed/user1/100/100', participationScore: 100, engagement: 95 },
  { id: 'usr_002', name: 'Jane Doe', email: 'jane.d@example.com', role: 'Executive Member', department: 'BBA', batch: '2021', avatarUrl: 'https://picsum.photos/seed/user2/100/100', participationScore: 85, engagement: 88 },
  { id: 'usr_003', name: 'John Smith', email: 'john.s@example.com', role: 'General Member', department: 'EEE', batch: '2022', avatarUrl: 'https://picsum.photos/seed/user3/100/100', participationScore: 60, engagement: 70 },
  { id: 'usr_004', name: 'Emily White', email: 'emily.w@example.com', role: 'General Member', department: 'CSE', batch: '2022', avatarUrl: 'https://picsum.photos/seed/user4/100/100', participationScore: 75, engagement: 80 },
  { id: 'usr_005', name: 'Michael Brown', email: 'michael.b@example.com', role: 'General Member', department: 'Civil', batch: '2021', avatarUrl: 'https://picsum.photos/seed/user5/100/100', participationScore: 40, engagement: 50 },
];

const today = new Date();
const daysAgo = (days: number) => new Date(today.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

export const mockSessions: Session[] = [
  { id: 'ses_001', title: 'Annual General Meeting 2024', description: 'The main AGM for the year.', type: 'AGM', date: daysAgo(2), attendees: [mockUsers[0], mockUsers[1], mockUsers[2], mockUsers[3]], totalMembers: mockUsers.length },
  { id: 'ses_002', title: 'Street Photography Workshop', description: 'A workshop on capturing urban life.', type: 'Workshop', date: daysAgo(10), attendees: [mockUsers[1], mockUsers[3], mockUsers[4]], totalMembers: mockUsers.length },
  { id: 'ses_003', title: 'Monthly General Meeting - June', description: 'Regular monthly meeting.', type: 'General Meeting', date: daysAgo(25), attendees: [mockUsers[0], mockUsers[1], mockUsers[2], mockUsers[3], mockUsers[4]], totalMembers: mockUsers.length },
  { id: 'ses_004', title: 'Portrait Lighting Seminar', description: 'Learn advanced lighting techniques.', type: 'Workshop', date: daysAgo(40), attendees: [mockUsers[1], mockUsers[3]], totalMembers: mockUsers.length },
];

export const mockRecentActivity: AttendanceRecord[] = [
    { id: 'ar_001', user: {id: mockUsers[2].id, name: mockUsers[2].name, avatarUrl: mockUsers[2].avatarUrl}, session: {id: mockSessions[0].id, title: mockSessions[0].title, date: mockSessions[0].date}, attendedAt: mockSessions[0].date },
    { id: 'ar_002', user: {id: mockUsers[3].id, name: mockUsers[3].name, avatarUrl: mockUsers[3].avatarUrl}, session: {id: mockSessions[0].id, title: mockSessions[0].title, date: mockSessions[0].date}, attendedAt: mockSessions[0].date },
    { id: 'ar_003', user: {id: mockUsers[1].id, name: mockUsers[1].name, avatarUrl: mockUsers[1].avatarUrl}, session: {id: mockSessions[1].id, title: mockSessions[1].title, date: mockSessions[1].date}, attendedAt: mockSessions[1].date },
    { id: 'ar_004', user: {id: mockUsers[4].id, name: mockUsers[4].name, avatarUrl: mockUsers[4].avatarUrl}, session: {id: mockSessions[1].id, title: mockSessions[1].title, date: mockSessions[1].date}, attendedAt: mockSessions[1].date },
];

export const loggedInUser = mockUsers[0]; // Assume admin is logged in
