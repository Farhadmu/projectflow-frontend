'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../../lib/api';
import { SubmissionDto, SubmissionStatus } from '@/shared';
import { Button } from '../../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { StatusBadge } from '../../../components/ui/status-badge';
import { formatDate } from '../../../lib/utils';
import {
  FolderGit2,
  PlusCircle,
  ExternalLink,
  Github,
  Search,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';

export default function StudentSubmissionsPage() {
  const [statusFilter, setStatusFilter] = useState<'ALL' | SubmissionStatus>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: submissions = [], isLoading, error } = useQuery<SubmissionDto[]>({
    queryKey: ['my-submissions'],
    queryFn: async () => {
      const res = await apiRequest<SubmissionDto[]>('/submissions');
      return res.data;
    },
  });

  const filtered = submissions.filter((item) => {
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesSearch =
      !searchTerm ||
      item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            My Submissions
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review your project status, mentor feedback, and update submissions.
          </p>
        </div>
        <Link href="/dashboard/submissions/new">
          <Button variant="primary">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Submit New Project
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            {(['ALL', SubmissionStatus.PENDING, SubmissionStatus.APPROVED, SubmissionStatus.REJECTED] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    statusFilter === status
                      ? 'bg-white text-indigo-700 shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {status === 'ALL' ? 'All Submissions' : status}
                </button>
              )
            )}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading submissions...
            </div>
          ) : error ? (
            <div className="p-12 text-center text-rose-600">
              Failed to load your submissions. Please refresh the page.
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <FolderGit2 className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-slate-600 font-medium">No matching submissions found</p>
              <p className="text-xs text-slate-400">
                {searchTerm || statusFilter !== 'ALL'
                  ? 'Try adjusting your search query or status filter.'
                  : 'You have not submitted any projects yet.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="p-5 sm:p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/dashboard/submissions/${item.id}`}
                        className="font-bold text-base text-slate-900 hover:text-indigo-600 transition-colors"
                      >
                        {item.projectName}
                      </Link>
                      <StatusBadge status={item.status} />
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-2 max-w-2xl">{item.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span>Submitted on {formatDate(item.createdAt)}</span>
                      <span className="text-slate-300">&bull;</span>
                      <a
                        href={item.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-slate-700 hover:text-indigo-600 font-medium"
                      >
                        <Github className="w-3.5 h-3.5" />
                        Repository
                      </a>
                      <span className="text-slate-300">&bull;</span>
                      <a
                        href={item.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-medium"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Live Demo
                      </a>

                      {item.feedback && item.feedback.length > 0 && (
                        <>
                          <span className="text-slate-300">&bull;</span>
                          <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-medium">
                            <MessageSquare className="w-3.5 h-3.5" />
                            {item.feedback.length} Mentor Note{item.feedback.length > 1 ? 's' : ''}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/dashboard/submissions/${item.id}`}>
                      <Button size="sm" variant="outline" className="gap-1.5">
                        Details &amp; Feedback
                        <ChevronRight className="w-3.5 h-3.5" />
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
