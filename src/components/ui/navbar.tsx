'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../providers/auth-provider';
import { Button } from './button';
import { Layers, LogOut, PlusCircle, CheckSquare, LayoutDashboard } from 'lucide-react';
import { UserRole } from '@/shared';

export function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();

  const isMentor = user?.role === UserRole.MENTOR;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href={user ? (isMentor ? '/mentor/dashboard' : '/dashboard') : '/'} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 bg-clip-text text-transparent">
              ProjectFlow
            </span>
          </Link>

          {/* Navigation Links for Authenticated Users */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {!isMentor ? (
                <>
                  <Link
                    href="/dashboard"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/dashboard'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Overview
                  </Link>
                  <Link
                    href="/dashboard/submissions"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/dashboard/submissions'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <CheckSquare className="w-4 h-4" />
                    My Submissions
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/mentor/dashboard"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/mentor/dashboard'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Mentor Dashboard
                  </Link>
                  <Link
                    href="/mentor/submissions"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname.startsWith('/mentor/submissions')
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <CheckSquare className="w-4 h-4" />
                    Review Queue
                  </Link>
                </>
              )}
            </nav>
          )}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="w-24 h-8 bg-slate-100 rounded animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              {/* Primary action for Student */}
              {!isMentor && (
                <Link href="/dashboard/submissions/new" className="hidden sm:inline-block">
                  <Button size="sm" variant="primary">
                    <PlusCircle className="w-4 h-4" />
                    Submit Project
                  </Button>
                </Link>
              )}

              {/* User badge */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-slate-800 leading-tight">{user.name}</p>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded tracking-wide ${
                      isMentor
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={logout}
                  className="text-slate-500 hover:text-rose-600"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button size="sm" variant="ghost">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" variant="primary">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
