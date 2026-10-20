'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../lib/api';
import { useAuth } from '../../providers/auth-provider';
import { SubmissionDto, SubmissionStatus } from '@/shared';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { StatusBadge } from '../../components/ui/status-badge';
import { formatDate } from '../../lib/utils';
import {
  FolderGit2,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  ExternalLink,
  Github,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { user } = useAuth();

  const { data: submissions = [], isLoading, error } = useQuery<SubmissionDto[]>({
    queryKey: ['my-submissions'],
    queryFn: async () => {
      const res = await apiRequest<SubmissionDto[]>('/submissions');
      return res.data;
    },
  });

  const total = submissions.length;
  const pending = submissions.filter((s) => s.status === SubmissionStatus.PENDING).length;
  const approved = submissions.filter((s) => s.status === SubmissionStatus.APPROVED).length;
  const rejected = submissions.filter((s) => s.status === SubmissionStatus.REJECTED).length;

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Student Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome, <strong className="text-slate-800">{user?.name}</strong>. Track your submitted projects and mentor evaluations.
          </p>
        </div>
        <Link href="/dashboard/submissions/new">
          <Button variant="primary" className="shadow-md">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Submit New Project
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Submissions</span>
              <FolderGit2 className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{isLoading ? '—' : total}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Under Review</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-amber-700">{isLoading ? '—' : pending}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Approved</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-700">{isLoading ? '—' : approved}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Needs Revision</span>
              <XCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-bold text-rose-700">{isLoading ? '—' : rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Submissions</CardTitle>
          {submissions.length > 0 && (
            <Link href="/dashboard/submissions" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
              View all ({submissions.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading submissions...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-rose-600">
              Failed to load submissions. Please check your backend connection.
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <p className="text-slate-600 font-medium">No projects submitted yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Submit your first GitHub repository and live deployment link to receive mentor evaluation and feedback.
              </p>
              <Link href="/dashboard/submissions/new" className="inline-block pt-2">
                <Button size="sm" variant="primary">
                  <PlusCircle className="w-4 h-4 mr-1.5" />
                  Submit Your First Project
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/75 border-b border-slate-100 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Project Name</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Links</th>
                    <th className="px-6 py-3.5">Submitted</th>
                    <th className="px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.slice(0, 5).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <Link
                          href={`/dashboard/submissions/${item.id}`}
                          className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors block"
                        >
                          {item.projectName}
                        </Link>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3 text-xs">
                          <a
                            href={item.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium"
                          >
                            <Github className="w-3.5 h-3.5" />
                            Repo
                          </a>
                          <a
                            href={item.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Live
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link href={`/dashboard/submissions/${item.id}`}>
                          <Button size="sm" variant="outline" className="text-xs">
                            {item.feedback && item.feedback.length > 0 && (
                              <MessageSquare className="w-3.5 h-3.5 text-indigo-600 mr-1" />
                            )}
                            View Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
