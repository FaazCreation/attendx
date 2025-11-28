'use client';
import { RegisterForm } from '@/components/auth/register-form';
import { FirebaseClientProvider } from '@/firebase';

export default function RegisterPage() {
    return (
        <FirebaseClientProvider>
            <RegisterForm />
        </FirebaseClientProvider>
    );
}
