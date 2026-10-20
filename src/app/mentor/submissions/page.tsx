'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../../lib/api';
import { PaginationMeta, SubmissionDto, SubmissionStatus } from '@/shared';
import { Button } from '../../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { StatusBadge } from '../../../components/ui/status-badge';
import { formatDate } from '../../../lib/utils';
import {
  Search,
  Github,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckSquare,
} from 'lucide-react';

export default function MentorSubmissionsListPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<string>('ALL');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  // Server-side filtered & paginated query
  const { data, isLoading, isPlaceholderData } = useQuery<{
    items: SubmissionDto[];
    meta: PaginationMeta;
  }>({
    queryKey: ['mentor-submissions', page, limit, status, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        status,
      });
      if (search) {
        params.set('search', search);
      }
      const res = await apiRequest<SubmissionDto[]>(`/mentor/submissions?${params.toString()}`);
      return {
        items: res.data,
        meta: res.meta as PaginationMeta,
      };
    },
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setPage(1);
  };

  const items = data?.items || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Submissions Review Queue
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Server-side filtered and paginated submissions across all registered students.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            {[
              { label: 'All Submissions', value: 'ALL' },
              { label: 'Pending Review', value: SubmissionStatus.PENDING },
              { label: 'Approved', value: SubmissionStatus.APPROVED },
              { label: 'Rejected', value: SubmissionStatus.REJECTED },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleStatusChange(tab.value)}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  status === tab.value
                    ? 'bg-white text-purple-700 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input Form */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full lg:w-80">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search project or student..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-3.5 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              />
            </div>
            <Button type="submit" size="sm" variant="secondary">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500">
              <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Fetching submissions from server...
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Filter className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-slate-700 font-medium">No matching submissions</p>
              <p className="text-xs text-slate-400">
                Try selecting a different status filter or clearing your search term.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/75 border-b border-slate-100 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Project &amp; Student</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Repository &amp; Live Demo</th>
                    <th className="px-6 py-3.5">Date Submitted</th>
                    <th className="px-6 py-3.5 text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <Link
                          href={`/mentor/submissions/${sub.id}`}
                          className="font-bold text-slate-900 hover:text-purple-600 transition-colors block"
                        >
                          {sub.projectName}
                        </Link>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Student: <span className="text-slate-800 font-medium">{sub.student?.name}</span>{' '}
                          <span className="text-slate-400">({sub.student?.email})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3 text-xs">
                          <a
                            href={sub.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 font-medium"
                          >
                            <Github className="w-3.5 h-3.5" />
                            Repo
                          </a>
                          <a
                            href={sub.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-medium"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Live Demo
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                        {formatDate(sub.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link href={`/mentor/submissions/${sub.id}`}>
                          <Button
                            size="sm"
                            variant={sub.status === SubmissionStatus.PENDING ? 'primary' : 'outline'}
                            className={
                              sub.status === SubmissionStatus.PENDING
                                ? 'bg-purple-600 hover:bg-purple-700'
                                : ''
                            }
                          >
                            {sub.status === SubmissionStatus.PENDING ? 'Review Now' : 'Edit Review'}
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

        {/* Server Pagination Controls */}
        {meta && (
          <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <div>
              Showing page <strong className="text-slate-900">{meta.page}</strong> of{' '}
              <strong className="text-slate-900">{meta.totalPages}</strong> ({meta.totalCount} total submissions)
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="mentor-page-limit" className="text-xs text-slate-500">
                Rows per page:
              </label>
              <select
                id="mentor-page-limit"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-purple-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>

              <div className="flex items-center gap-1 ml-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!meta.hasPrevPage || isPlaceholderData}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!meta.hasNextPage || isPlaceholderData}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-2"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
