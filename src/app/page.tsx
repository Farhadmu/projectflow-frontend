'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import {
  Layers,
  ShieldCheck,
  CheckCircle,
  Database,
  ArrowRight,
  GitBranch,
  Filter,
  BarChart3,
  ExternalLink,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-12 py-6">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm">
          <Layers className="w-3.5 h-3.5" />
          Programming Hero Associate Web Instructor Hiring Task
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Student Project Submission &amp; Mentor Review Dashboard
        </h1>

        <p className="text-lg text-slate-600 leading-relaxed">
          A full-stack, production-minded platform featuring role-based access control (RBAC),
          defensive form validation with Zod, database duplicate prevention, server-side pagination,
          and live PostgreSQL metrics.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/login">
            <Button size="lg" variant="primary">
              Log In to Portal <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="outline">
              Create Student Account
            </Button>
          </Link>
        </div>
      </div>

      {/* Evaluator Quick Access Credentials Banner */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-700/60 pb-6 mb-6">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-300">
                For Assessor &amp; Reviewer
              </span>
              <h2 className="text-xl font-bold mt-1">Ready-to-Use Seed Credentials</h2>
              <p className="text-sm text-indigo-200 mt-1">
                Both accounts are seeded in PostgreSQL with existing projects ready for evaluation.
              </p>
            </div>
            <Link href="/login">
              <Button size="sm" className="bg-white text-indigo-900 hover:bg-indigo-50 border-0">
                Go to Quick Login &rarr;
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/15">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/30 text-purple-200 border border-purple-400/40">
                  Mentor Account
                </span>
                <span className="text-xs text-indigo-200">Full review &amp; stats access</span>
              </div>
              <p className="text-sm font-mono text-slate-100">mentor@projectflow.dev</p>
              <p className="text-xs font-mono text-indigo-300 mt-0.5">MentorSecurePassword123!</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/15">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200 border border-emerald-400/40">
                  Student Account
                </span>
                <span className="text-xs text-indigo-200">Submit &amp; track projects</span>
              </div>
              <p className="text-sm font-mono text-slate-100">student@projectflow.dev</p>
              <p className="text-xs font-mono text-indigo-300 mt-0.5">StudentSecurePassword123!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="space-y-3 pt-6">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-slate-900">Strict JWT RBAC</h3>
            <p className="text-sm text-slate-600">
              Students cannot approve submissions or elevate roles. Reusable Express middleware
              verifies signatures and enforces permissions server-side.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="space-y-3 pt-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <GitBranch className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-slate-900">Defensive Validation</h3>
            <p className="text-sm text-slate-600">
              Frontend React Hook Form mirrors backend Zod schemas. URLs are normalized to prevent
              duplicate repository submissions at both app and database level.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="space-y-3 pt-6">
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-slate-900">Live PostgreSQL Metrics</h3>
            <p className="text-sm text-slate-600">
              Server-side pagination and status filtering execute directly in PostgreSQL. Aggregated
              counts update live upon mentor review actions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
