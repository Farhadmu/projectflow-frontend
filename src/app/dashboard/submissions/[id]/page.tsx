'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../../../lib/api';
import { SubmissionDto } from '@/shared';
import { Button } from '../../../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/card';
import { StatusBadge } from '../../../../components/ui/status-badge';
import { formatDate } from '../../../../lib/utils';
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Calendar,
  UserCheck,
  MessageSquare,
  AlertCircle,
  FileCode,
} from 'lucide-react';

export default function StudentSubmissionDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: submission, isLoading, error } = useQuery<SubmissionDto>({
    queryKey: ['submission-detail', id],
    queryFn: async () => {
      const res = await apiRequest<SubmissionDto>(`/submissions/${id}`);
      return res.data;
    },
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="py-16 text-center text-slate-500 space-y-2">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm">Loading submission details...</p>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Submission Not Found</h2>
        <p className="text-sm text-slate-500">
          This submission does not exist or you do not have permission to view another student&apos;s private record.
        </p>
        <Link href="/dashboard/submissions">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to My Submissions
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/submissions">
          <Button size="sm" variant="outline" className="gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            Back to Submissions
          </Button>
        </Link>
        <StatusBadge status={submission.status} />
      </div>

      {/* Main Details Card */}
      <Card>
        <CardHeader>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileCode className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-2xl">{submission.projectName}</CardTitle>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Submitted {formatDate(submission.createdAt)}
              </span>
              {submission.reviewedAt && (
                <span className="flex items-center gap-1 text-indigo-700 font-medium">
                  <UserCheck className="w-3.5 h-3.5" />
                  Reviewed on {formatDate(submission.reviewedAt)}
                </span>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Action Links */}
          <div className="grid sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <a
              href={submission.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Github className="w-4 h-4 text-slate-700 shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-900">GitHub Repository</p>
                  <p className="text-[11px] text-slate-400 truncate">{submission.repoUrl}</p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-2" />
            </a>

            <a
              href={submission.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <ExternalLink className="w-4 h-4 text-indigo-600 shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-900">Live Web App</p>
                  <p className="text-[11px] text-slate-400 truncate">{submission.liveUrl}</p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-2" />
            </a>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Project Description &amp; Notes
            </h4>
            <div className="p-4 bg-white rounded-lg border border-slate-200 text-sm text-slate-850 leading-relaxed whitespace-pre-wrap">
              {submission.description}
            </div>
          </div>

          {/* Mentor Feedback Thread */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <h4 className="text-sm font-bold text-slate-900">
                Mentor Feedback &amp; Review History
              </h4>
            </div>

            {!submission.feedback || submission.feedback.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80 text-center text-xs text-slate-500">
                No mentor feedback has been recorded yet. Your submission is currently waiting in the evaluation queue.
              </div>
            ) : (
              <div className="space-y-3">
                {submission.feedback.map((fb) => (
                  <div
                    key={fb.id}
                    className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-purple-900">
                        {fb.mentor?.name || 'Assigned Instructor'}
                      </span>
                      <span className="text-purple-600">{formatDate(fb.createdAt)}</span>
                    </div>
                    <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                      {fb.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
