'use client';

import { LoginForm } from '@/app/auth/components/LoginForm';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}