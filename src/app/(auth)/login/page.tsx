'use client';
import { LoginForm } from '@/components/auth/login-form';
import { FirebaseClientProvider } from '@/firebase';

export default function LoginPage() {
  return (
    <FirebaseClientProvider>
      <LoginForm />
    </FirebaseClientProvider>
  );
}
