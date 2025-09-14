'use client';

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/contexts/AuthContext";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <SessionProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </SessionProvider>
  );
}
