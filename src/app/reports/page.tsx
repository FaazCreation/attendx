
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Users } from 'lucide-react';
import { useFirestore, useCollection, useUser, useDoc } from '@/firebase';
import { collection, collectionGroup, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

interface EnrichedAttendanceRecord {
    userName: string;
    userEmail: string;
    sessionTitle: string;
    sessionDate: string;
    attendedAt: string;
}

function AdminReportPage() {
  const firestore = useFirestore();
  const [enrichedData, setEnrichedData] = useState<EnrichedAttendanceRecord[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [totalAttendees, setTotalAttendees] = useState(0);

  const { data: allSessions, isLoading: sessionsLoading } = useCollection<Session>(
    () => firestore ? collection(firestore, 'attendanceSessions') : null,
    [firestore]
  );
  
  useEffect(() => {
    if (allSessions) {
        const sortedSessions = [...allSessions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setSessions(sortedSessions);
    }
  }, [allSessions]);
  
  useEffect(() => {
    const processData = async () => {
        if (!firestore) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        const recordsQuery = selectedSessionId === 'all' 
            ? collectionGroup(firestore, 'attendanceRecords')
            : query(collection(firestore, `attendanceSessions/${selectedSessionId}/attendanceRecords`));
        
        try {
            const attendanceSnapshot = await getDocs(recordsQuery);
            setTotalAttendees(attendanceSnapshot.size);

            const userCache = new Map<string, User>();
            const sessionCache = new Map<string, Session>();
            
            const enrichedRecords = await Promise.all(
                attendanceSnapshot.docs.map(async (recordDoc) => {
                    const record = recordDoc.data() as AttendanceRecord;
                    let user: User | undefined = userCache.get(record.userId);
                    let session: Session | undefined = sessionCache.get(record.sessionId);

                    if (!user) {
                        const userDoc = await getDoc(doc(firestore, 'users', record.userId));
                        if (userDoc.exists()) {
                            user = userDoc.data() as User;
                            userCache.set(record.userId, user);
                        }
                    }

                    if (!session) {
                       const sessionDoc = await getDoc(doc(firestore, 'attendanceSessions', record.sessionId));
                        if (sessionDoc.exists()) {
                            session = sessionDoc.data() as Session;
                            sessionCache.set(record.sessionId, session);
                        }
                    }

                    return {
                        userName: user?.name || 'Unknown User',
                        userEmail: user?.email || '-',
                        sessionTitle: session?.title || 'Unknown Session',
                        sessionDate: session ? new Date(session.date).toLocaleDateString() : '-',
                        attendedAt: record.timestamp ? new Date(record.timestamp.seconds * 1000).toLocaleString() : 'N/A',
                    };
                })
            );
            
            setEnrichedData(enrichedRecords.sort((a, b) => new Date(b.attendedAt).getTime() - new Date(a.attendedAt).getTime()));
        } catch(e) {
            console.error("Error fetching attendance data: ", e);
        } finally {
            setIsLoading(false);
        }
    };

    processData();
  }, [selectedSessionId, firestore]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    const sessionTitle = selectedSessionId === 'all' 
        ? 'All Sessions' 
        : sessions.find(s => s.id === selectedSessionId)?.title || 'Attendance Report';

    doc.text(sessionTitle, 14, 16);
    doc.text(`Total Attendees: ${totalAttendees}`, 14, 22);

    const tableColumn = ["Member Name", "Email", "Session Title", "Session Date", "Attended At"];
    const tableRows: any[] = [];

    enrichedData.forEach(item => {
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
      startY: 28,
    });

    doc.save(`${sessionTitle.replace(/ /g, '_')}-attendance-report.pdf`);
  };
  
  return (
    <>
        <Head>
            <title>অ্যাটেনডেন্স রিপোর্ট | AttendX</title>
        </Head>
        <div className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className='flex-1'>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    অ্যাটেনডেন্স রিপোর্ট
                    </h1>
                    <p className="text-sm text-muted-foreground">সেশন অনুযায়ী অ্যাটেনডেন্সের রিপোর্ট দেখুন এবং এক্সপোর্ট করুন।</p>
                </div>
                <div className="flex items-center gap-2">
                    <Select onValueChange={setSelectedSessionId} defaultValue="all" disabled={sessionsLoading}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="সেশন ফিল্টার করুন" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">সকল সেশন</SelectItem>
                            {sessions.map(session => (
                                <SelectItem key={session.id} value={session.id}>
                                    {session.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={exportToPDF} disabled={isLoading || !enrichedData.length}>
                        <Download className="mr-2 h-4 w-4" />
                        PDF এক্সপোর্ট
                    </Button>
                </div>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>
                        {selectedSessionId === 'all' ? 'সম্পূর্ণ অ্যাটেনডেন্সের বিবরণ' : sessions.find(s=> s.id === selectedSessionId)?.title}
                    </CardTitle>
                    <CardDescription>
                        <div className='flex items-center gap-2'>
                            <Users className="h-4 w-4" />
                            <span> মোট উপস্থিতি: {isLoading ? <Skeleton className="h-4 w-6 inline-block" /> : totalAttendees}</span>
                        </div>
                    </CardDescription>
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
                                    {selectedSessionId === 'all' && <TableHead>সেশনের নাম</TableHead>}
                                    <TableHead>উপস্থিতির সময়</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {enrichedData.length > 0 ? (
                                    enrichedData.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div className="font-medium">{item.userName}</div>
                                                <div className="text-sm text-muted-foreground">{item.userEmail}</div>
                                            </TableCell>
                                            {selectedSessionId === 'all' && 
                                                <TableCell>
                                                    <div>{item.sessionTitle}</div>
                                                    <div className="text-sm text-muted-foreground">{item.sessionDate}</div>
                                                </TableCell>
                                            }
                                            <TableCell>{item.attendedAt}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={selectedSessionId === 'all' ? 3 : 2} className="h-24 text-center">
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
    </>
  )
}


// This is a protected route for admins only.
export default function ReportsPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();

    const { data: userData, isLoading: isUserRoleLoading } = useDoc(() => {
        if (!user || !firestore) return null;
        return doc(firestore, 'users', user.uid);
    }, [user, firestore]);

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
            return;
        }
        if (!isUserRoleLoading && user && userData?.role !== 'Admin') {
            router.push('/dashboard');
            return;
        }
    }, [isUserLoading, user, isUserRoleLoading, userData, router]);


    if (isUserLoading || isUserRoleLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            </div>
        )
    }

    if (userData?.role === 'Admin') {
        return <AdminReportPage />;
    }

    return null;
}
