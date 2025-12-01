
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useFirestore, useCollection, useUser, useDoc } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface User {
  uid: string;
  name: string;
  email: string;
  department?: string;
  batch?: string;
  role?: string;
  photoURL?: string;
}

const getRoleInBangla = (role: string) => {
    switch(role) {
        case 'Admin': return 'অ্যাডমিন';
        case 'General Member': return 'সাধারণ সদস্য';
        default: return role;
    }
}


function AdminMembersPage() {
  const firestore = useFirestore();

  const { data: users, isLoading: usersLoading } = useCollection<User>(
    () => firestore ? collection(firestore, 'users') : null,
    [firestore]
  );
  
  const isLoading = usersLoading;

  return (
    <>
        <Head>
            <title>সদস্য তালিকা | AttendX</title>
        </Head>
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                সদস্য তালিকা
                </h1>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>ক্লাবের সকল সদস্য</CardTitle>
                    <CardDescription>এখানে ক্লাবের সকল নিবন্ধিত সদস্যদের তালিকা দেখানো হয়েছে।</CardDescription>
                </CardHeader>
                <CardContent>
                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>নাম</TableHead>
                                    <TableHead>বিভাগ</TableHead>
                                    <TableHead>ব্যাচ</TableHead>
                                    <TableHead>ভূমিকা</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users && users.length > 0 ? (
                                    users.map((user) => (
                                        <TableRow key={user.uid}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage src={user.photoURL} alt={user.name} />
                                                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{user.name}</div>
                                                        <div className="text-sm text-muted-foreground">{user.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{user.department}</TableCell>
                                            <TableCell>{user.batch}</TableCell>
                                            <TableCell>{user.role ? getRoleInBangla(user.role) : 'N/A'}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            কোনো সদস্য পাওয়া যায়নি।
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
export default function MembersPage() {
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
        return <AdminMembersPage />;
    }

    return null;
}
