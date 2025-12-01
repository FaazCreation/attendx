'use client';
import { AdminLoginForm } from '@/components/auth/admin-login-form';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function AdminLoginPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const firestore = useFirestore();

    const { data: userData, isLoading: isUserRoleLoading } = useDoc(() => {
        if (!user || !firestore) return null;
        return doc(firestore, 'users', user.uid);
    }, [user, firestore]);

    useEffect(() => {
        // If user is logged in and is an admin, redirect to admin dashboard
        if (!isUserLoading && !isUserRoleLoading && user && userData?.role === 'Admin') {
            router.push('/admin/dashboard');
        }
    }, [user, isUserLoading, userData, isUserRoleLoading, router]);

  return (
      <AdminLoginForm />
  );
}
