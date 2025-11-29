'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

// This type is based on your User entity
export type User = {
  id: string;
  uid: string;
  name: string;
  email: string;
  department: string;
  batch: string;
  role: 'Admin' | 'Executive Member' | 'General Member';
};

const RoleChanger = ({ user: targetUser }: { user: User }) => {
  const firestore = useFirestore();
  const { user: currentUser } = useUser();
  const { toast } = useToast();
  const userRoles: User['role'][] = ['Admin', 'Executive Member', 'General Member'];

  const currentUserDocRef = useMemoFirebase(() => {
    if (!firestore || !currentUser) return null;
    return doc(firestore, 'users', currentUser.uid);
  }, [firestore, currentUser]);

  const { data: currentUserData } = useDoc(currentUserDocRef);
  
  const currentUserIsAdmin = currentUserData?.role === 'Admin';
  
  const handleChangeRole = (newRole: User['role']) => {
    if (!firestore) return;
    
    if (targetUser.role === 'Admin' && !currentUserIsAdmin) {
      toast({
        variant: 'destructive',
        title: 'অনুমতি নেই',
        description: "আপনি অন্য অ্যাডমিনের ভূমিকা পরিবর্তন করতে পারবেন না।",
      });
      return;
    }
    
    // An admin cannot demote themselves if they are the only admin
    if (targetUser.role === 'Admin' && newRole !== 'Admin' && currentUser?.uid === targetUser.uid) {
        toast({
            variant: 'destructive',
            title: 'কার্যক্রম অনুমোদিত নয়',
            description: "আপনি নিজেকে অ্যাডমিন ভূমিকা থেকে সরাতে পারবেন না।",
        });
        return;
    }

    const userDocRef = doc(firestore, 'users', targetUser.uid);
    const updatedData = { role: newRole };

    updateDoc(userDocRef, updatedData)
      .then(() => {
        toast({
          title: 'ভূমিকা আপডেট হয়েছে',
          description: `${targetUser.name}-এর ভূমিকা ${newRole}-এ পরিবর্তন করা হয়েছে।`,
        });
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'update',
            requestResourceData: updatedData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
      
    toast({
      title: 'অনুরোধ পাঠানো হয়েছে',
      description: `${targetUser.name}-এর ভূমিকা ${newRole}-এ পরিবর্তন করার চেষ্টা করা হচ্ছে।`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
            variant="ghost" 
            className="h-8 w-8 p-0" 
            disabled={!currentUserIsAdmin || (targetUser.role === 'Admin' && currentUser?.uid !== targetUser.uid && !currentUserIsAdmin)}
        >
          <span className="sr-only">মেনু খুলুন</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>কার্যক্রম</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-light">ভূমিকা পরিবর্তন করুন</DropdownMenuLabel>
        {userRoles.map((role) => (
          <DropdownMenuItem
            key={role}
            onClick={() => handleChangeRole(role)}
            disabled={targetUser.role === role}
          >
            {role} হিসেবে সেট করুন
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'নাম',
  },
  {
    accessorKey: 'email',
    header: 'ইমেইল',
  },
  {
    accessorKey: 'department',
    header: 'বিভাগ',
  },
  {
    accessorKey: 'batch',
    header: 'সেশন',
  },
  {
    accessorKey: 'role',
    header: 'ভূমিকা',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original;
      return <RoleChanger user={user} />;
    },
  },
];
