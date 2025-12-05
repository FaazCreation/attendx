
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

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

export function MembersTable() {
  const firestore = useFirestore();

  // Query for the first 5 users to show on the dashboard
  const { data: users, isLoading } = useCollection<User>(
    () => firestore ? query(collection(firestore, 'users'), limit(5)) : null,
    [firestore]
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>সাম্প্রতিক সদস্য</CardTitle>
          <CardDescription>ক্লাবের সর্বশেষ নিবন্ধিত সদস্যদের দেখুন।</CardDescription>
        </div>
        <Button asChild variant="outline" size="sm">
            <Link href="/members">
                সকল সদস্য দেখুন
                <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>নাম</TableHead>
                  <TableHead className="hidden sm:table-cell">বিভাগ</TableHead>
                  <TableHead className="hidden md:table-cell">ব্যাচ</TableHead>
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
                      <TableCell className="hidden sm:table-cell">{user.department}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.batch}</TableCell>
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
  );
}

    