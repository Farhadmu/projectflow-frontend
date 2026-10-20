'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../../lib/api';
import { MentorStats, SubmissionDto } from '@/shared';
import { Button } from '../../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { StatusBadge } from '../../../components/ui/status-badge';
import { formatDate } from '../../../lib/utils';
import {
  ShieldCheck,
  FolderGit2,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ExternalLink,
  Github,
  Award,
} from 'lucide-react';

export default function MentorDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery<MentorStats>({
    queryKey: ['mentor-stats'],
    queryFn: async () => {
      const res = await apiRequest<MentorStats>('/mentor/statistics');
      return res.data;
    },
  });

  const { data: pendingData, isLoading: pendingLoading } = useQuery<{ items: SubmissionDto[] }>({
    queryKey: ['mentor-pending-submissions'],
    queryFn: async () => {
      const res = await apiRequest<SubmissionDto[]>('/mentor/submissions?status=PENDING&limit=5');
      return { items: res.data };
    },
  });

  const pendingItems = pendingData?.items || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Mentor Review Dashboard
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
              Instructor Panel
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Evaluate student submissions, provide qualitative feedback, and manage project approvals.
          </p>
        </div>
        <Link href="/mentor/submissions">
          <Button variant="primary" className="bg-purple-600 hover:bg-purple-700 shadow-purple-200">
            Open Full Review Queue &rarr;
          </Button>
        </Link>
      </div>

      {/* Aggregate Statistics Cards (Database-Backed) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Submissions</span>
              <FolderGit2 className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {statsLoading ? '—' : stats?.totalSubmissions ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 bg-amber-50/20">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Awaiting Review</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-amber-700">
              {statsLoading ? '—' : stats?.totalPending ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Approved</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-700">
              {statsLoading ? '—' : stats?.totalApproved ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Changes Requested</span>
              <XCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-bold text-rose-700">
              {statsLoading ? '—' : stats?.totalRejected ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Review Queue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Priority Review Queue (Pending)</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Submissions waiting earliest for instructor evaluation
            </p>
          </div>
          <Link href="/mentor/submissions?status=PENDING" className="text-xs text-purple-600 font-semibold hover:underline flex items-center gap-1">
            View all pending <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          {pendingLoading ? (
            <div className="p-8 text-center text-slate-500">
              <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading pending queue...
            </div>
          ) : pendingItems.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-slate-800 font-semibold">All Caught Up!</p>
              <p className="text-xs text-slate-500">No submissions are currently pending review.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingItems.map((item) => (
                <div
                  key={item.id}
                  className="p-5 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{item.projectName}</span>
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>Student: <strong className="text-slate-700">{item.student?.name}</strong> ({item.student?.email})</span>
                      <span>&bull;</span>
                      <span>Submitted: {formatDate(item.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={item.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium"
                    >
                      <Github className="w-3.5 h-3.5" />
                      Repo
                    </a>
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs inline-flex items-center gap-1 text-indigo-600 hover:underline font-medium"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Live
                    </a>
                    <Link href={`/mentor/submissions/${item.id}`}>
                      <Button size="sm" variant="primary" className="bg-purple-600 hover:bg-purple-700">
                        Review Now &rarr;
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
