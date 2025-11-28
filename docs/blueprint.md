# **App Name**: TCPC Connect

## Core Features:

- Role-Based Authentication: Firebase Authentication (Email/Google) with Firestore to manage Admin, Executive, and General Member roles.
- Attendance Session Creation: Admin creates sessions (General Meeting, AGM, Event, Workshop) with title, description, date, time, and type. System auto-generates unique attendance codes and QR codes.
- Member Attendance Recording: Members can submit attendance by entering the attendance code or scanning a QR code, then their attendance is validated and recorded in Firestore to prevent duplicate entries.
- Dashboard Analytics: Admin dashboard that displays total attendees and absentees, member participation history. Features export to Excel. Includes charts for attendance analysis.
- Personalized Member Profile: Profile management, allowing users to manage their Name, department, batch and photo. Attendance history, participation score, and an engagement progress bar are displayed.
- Realtime Notifications: Using Firebase Cloud Messaging, admins can notify members about meetings, workshops and attendance confirmations.
- Attendance Trend Tool: Generative AI analyzes past attendance records to highlight members that have attended below the required threshold, offering an objective tool for internal evaluation purposes.

## Style Guidelines:

- Primary color: Deep blue (#1A237E) to evoke a sense of professionalism and trust.
- Background color: Light gray (#F5F5F5) for a clean, modern look.
- Accent color: Teal (#008080) to add vibrancy and highlight important actions.
- Body and headline font: 'PT Sans', a modern, humanist sans-serif, provides both approachability and a contemporary aesthetic suitable for headlines and body text alike.
- Use consistent, professional icons from a library like Material Design Icons, focusing on clarity.
- Separate pages for Login, Dashboard, Attendance, QR Scan, Profile, and Reports to maintain a clean user experience.
- Subtle transitions and feedback animations to enhance usability and provide visual cues without being distracting.