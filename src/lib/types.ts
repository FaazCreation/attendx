export type UserRole = "Admin" | "Executive Member" | "General Member";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  batch: string;
  avatarUrl: string;
  participationScore: number;
  engagement: number; // Percentage
};

export type SessionType = "General Meeting" | "AGM" | "Event" | "Workshop";

export type Session = {
  id: string;
  title: string;
  description: string;
  type: SessionType;
  date: string;
  attendees: User[];
  totalMembers: number;
};

export type AttendanceRecord = {
  id: string;
  user: Pick<User, 'id' | 'name' | 'avatarUrl'>;
  session: Pick<Session, 'id' | 'title' | 'date'>;
  attendedAt: string;
};
