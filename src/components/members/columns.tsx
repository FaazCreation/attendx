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
        title: 'Permission Denied',
        description: "You cannot change another admin's role.",
      });
      return;
    }
    
    // An admin cannot demote themselves if they are the only admin
    if (targetUser.role === 'Admin' && newRole !== 'Admin' && currentUser?.uid === targetUser.uid) {
        toast({
            variant: 'destructive',
            title: 'Action Not Allowed',
            description: "You cannot demote yourself from the Admin role.",
        });
        return;
    }

    const userDocRef = doc(firestore, 'users', targetUser.uid);
    const updatedData = { role: newRole };

    updateDoc(userDocRef, updatedData)
      .then(() => {
        toast({
          title: 'Role Updated',
          description: `${targetUser.name}'s role has been changed to ${newRole}.`,
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
      title: 'Request sent',
      description: `Attempting to change ${targetUser.name}'s role to ${newRole}.`,
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
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-light">Change Role</DropdownMenuLabel>
        {userRoles.map((role) => (
          <DropdownMenuItem
            key={role}
            onClick={() => handleChangeRole(role)}
            disabled={targetUser.role === role}
          >
            Set as {role}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'department',
    header: 'Department',
  },
  {
    accessorKey: 'batch',
    header: 'Session',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original;
      return <RoleChanger user={user} />;
    },
  },
];
