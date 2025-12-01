
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, collectionGroup } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Metadata } from 'next';

// This is not a page component, so we can't export metadata
// export const metadata: Metadata = {
//   title: 'অ্যাটেনডেন্স রিপোর্ট | AttendX',
// };


interface User {
  uid: string;
  name: string;
  email: string;
  department?: string;
  batch?: string;
}

interface Session {
  id: string;
  title: string;
  date: string;
}

interface AttendanceRecord {
  sessionId: string;
  userId: string;
  timestamp: any;
}

export default function AdminReportPage() {
  const firestore = useFirestore();

  const { data: users, isLoading: usersLoading } = useCollection<User>(
    () => firestore ? collection(firestore, 'users') : null,
    [firestore]
  );

  const { data: sessions, isLoading: sessionsLoading } = useCollection<Session>(
    () => firestore ? collection(firestore, 'attendanceSessions') : null,
    [firestore]
  );

  const { data: attendanceRecords, isLoading: attendanceLoading } = useCollection<AttendanceRecord>(
    () => firestore ? collectionGroup(firestore, 'attendanceRecords') : null,
    [firestore]
  );

  const isLoading = usersLoading || sessionsLoading || attendanceLoading;

  const attendanceData = useMemo(() => {
    if (!users || !sessions || !attendanceRecords) return [];

    const userMap = new Map(users.map(u => [u.uid, u]));
    const sessionMap = new Map(sessions.map(s => [s.id, s]));

    return attendanceRecords.map(record => {
      const user = userMap.get(record.userId);
      const session = sessionMap.get(record.sessionId);
      return {
        userName: user?.name || 'Unknown User',
        userEmail: user?.email || '-',
        sessionTitle: session?.title || 'Unknown Session',
        sessionDate: session ? new Date(session.date).toLocaleDateString() : '-',
        attendedAt: record.timestamp ? new Date(record.timestamp.seconds * 1000).toLocaleString() : 'N/A',
      };
    }).sort((a, b) => new Date(b.attendedAt).getTime() - new Date(a.attendedAt).getTime());
  }, [users, sessions, attendanceRecords]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Attendance Report', 14, 16);

    const tableColumn = ["Member Name", "Email", "Session Title", "Session Date", "Attended At"];
    const tableRows: any[] = [];

    attendanceData.forEach(item => {
      const row = [
        item.userName,
        item.userEmail,
        item.sessionTitle,
        item.sessionDate,
        item.attendedAt,
      ];
      tableRows.push(row);
    });

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('attendance-report.pdf');
  };
  return (
    <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            অ্যাটেনডেন্স রিপোর্ট
            </h1>
            <Button onClick={exportToPDF} disabled={isLoading || !attendanceData.length}>
            <Download className="mr-2 h-4 w-4" />
            PDF এক্সপোর্ট করুন
            </Button>
        </div>
        
        <Card>
            <CardHeader>
            <CardTitle>সম্পূর্ণ অ্যাটেনডেন্সের বিবরণ</CardTitle>
            <CardDescription>এখানে সকল সেশনে সদস্যদের উপস্থিতির রেকর্ড দেখানো হয়েছে।</CardDescription>
            </CardHeader>
            <CardContent>
            {isLoading ? (
                <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>সদস্যের নাম</TableHead>
                                <TableHead>সেশনের নাম</TableHead>
                                <TableHead>উপস্থিতির সময়</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attendanceData.length > 0 ? (
                                attendanceData.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="font-medium">{item.userName}</div>
                                            <div className="text-sm text-muted-foreground">{item.userEmail}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div>{item.sessionTitle}</div>
                                            <div className="text-sm text-muted-foreground">{item.sessionDate}</div>
                                        </TableCell>
                                        <TableCell>{item.attendedAt}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">
                                    কোনো অ্যাটেনডেন্স রেকর্ড পাওয়া যায়নি।
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
            </CardContent>
        </Card>
    </div>
  )
}
