'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../providers/auth-provider';
import { UserRole } from '@/shared';
import { Loader2 } from 'lucide-react';

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== UserRole.MENTOR) {
        // Prevent student access to mentor pages
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== UserRole.MENTOR) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-7 h-7 animate-spin text-purple-600" />
        <p className="text-sm">Verifying mentor credentials...</p>
      </div>
    );
  }

  return <>{children}</>;
}
