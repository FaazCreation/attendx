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
import { useFirestore } from '@/firebase';
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

const RoleChanger = ({ user }: { user: User }) => {
  const firestore = useFirestore();
  const { toast } = useToast();
  const userRoles: User['role'][] = ['Admin', 'Executive Member', 'General Member'];

  const handleChangeRole = (newRole: User['role']) => {
    if (!firestore) return;
    const userDocRef = doc(firestore, 'users', user.uid);
    
    // Using a non-blocking update and chaining the catch for error handling.
    updateDoc(userDocRef, { role: newRole })
      .catch((serverError) => {
        // Create the rich, contextual error.
        const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'update',
            requestResourceData: { role: newRole }, // This is the data we attempted to write
        });

        // Emit the error to be caught by the global listener.
        errorEmitter.emit('permission-error', permissionError);
      });
      
    // Optimistically show a toast. If it fails, the error boundary will appear.
    toast({
      title: 'Request sent',
      description: `Attempting to change ${user.name}'s role to ${newRole}.`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
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
            disabled={user.role === role}
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
