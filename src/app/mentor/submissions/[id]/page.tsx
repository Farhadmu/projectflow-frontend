'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiRequest } from '../../../../lib/api';
import {
  reviewSubmissionSchema,
  ReviewSubmissionInput,
  SubmissionDto,
  SubmissionStatus,
} from '@/shared';
import { Button } from '../../../../components/ui/button';
import { Textarea } from '../../../../components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/card';
import { StatusBadge } from '../../../../components/ui/status-badge';
import { formatDate } from '../../../../lib/utils';
import {
  ArrowLeft,
  Github,
  ExternalLink,
  CheckCircle2,
  XCircle,
  MessageSquare,
  AlertCircle,
  FileCode,
  User,
  Calendar,
  Send,
} from 'lucide-react';

export default function MentorSubmissionDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch submission data
  const { data: submission, isLoading, error } = useQuery<SubmissionDto>({
    queryKey: ['mentor-submission-detail', id],
    queryFn: async () => {
      const res = await apiRequest<SubmissionDto>(`/mentor/submissions/${id}`);
      return res.data;
    },
    enabled: Boolean(id),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReviewSubmissionInput>({
    resolver: zodResolver(reviewSubmissionSchema),
    defaultValues: {
      status: SubmissionStatus.APPROVED,
      comment: '',
    },
  });

  const selectedStatus = watch('status');
  const commentValue = watch('comment') || '';

  // Mutation to update submission status
  const reviewMutation = useMutation({
    mutationFn: async (data: ReviewSubmissionInput) => {
      const res = await apiRequest<SubmissionDto>(`/mentor/submissions/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return res.data;
    },
    onSuccess: (updated) => {
      setSuccessMessage(`Submission marked as ${updated.status} successfully.`);
      queryClient.invalidateQueries({ queryKey: ['mentor-submission-detail', id] });
      queryClient.invalidateQueries({ queryKey: ['mentor-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['mentor-stats'] });
      setValue('comment', '');
    },
    onError: (err: unknown) => {
      const error = err as { message: string };
      setServerError(error.message || 'Failed to submit review.');
    },
  });

  const onSubmit = async (data: ReviewSubmissionInput) => {
    setServerError(null);
    setSuccessMessage(null);
    await reviewMutation.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center text-slate-500 space-y-2">
        <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm">Loading submission for review...</p>
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
        <p className="text-sm text-slate-500">The requested submission could not be located.</p>
        <Link href="/mentor/submissions">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Queue
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/mentor/submissions">
          <Button size="sm" variant="outline" className="gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            Back to Review Queue
          </Button>
        </Link>
        <StatusBadge status={submission.status} />
      </div>

      {/* Project Details */}
      <Card>
        <CardHeader>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileCode className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-2xl">{submission.projectName}</CardTitle>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-600" />
                Submitted by: <strong className="text-slate-800">{submission.student?.name}</strong> ({submission.student?.email})
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(submission.createdAt)}
              </span>
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
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Github className="w-4 h-4 text-slate-700 shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-900">GitHub Repository</p>
                  <p className="text-[11px] text-slate-400 truncate">{submission.repoUrl}</p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 shrink-0 ml-2" />
            </a>

            <a
              href={submission.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <ExternalLink className="w-4 h-4 text-purple-600 shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-900">Live Web App</p>
                  <p className="text-[11px] text-slate-400 truncate">{submission.liveUrl}</p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 shrink-0 ml-2" />
            </a>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Student Project Description
            </h4>
            <div className="p-4 bg-white rounded-lg border border-slate-200 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
              {submission.description}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Action Form Card */}
      <Card className="border-2 border-purple-200 shadow-md">
        <CardHeader className="bg-purple-50/50">
          <CardTitle className="text-lg text-purple-950">Mentor Review Decision</CardTitle>
          <p className="text-xs text-slate-600 mt-1">
            Choose whether to approve or reject this submission and provide constructive feedback to the student.
          </p>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError && (
              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-700 text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Decision Radio Buttons */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Review Decision
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setValue('status', SubmissionStatus.APPROVED, { shouldValidate: true })}
                  className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 font-semibold text-sm transition-all ${
                    selectedStatus === SubmissionStatus.APPROVED
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/30 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Approve Submission
                </button>

                <button
                  type="button"
                  onClick={() => setValue('status', SubmissionStatus.REJECTED, { shouldValidate: true })}
                  className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 font-semibold text-sm transition-all ${
                    selectedStatus === SubmissionStatus.REJECTED
                      ? 'border-rose-500 bg-rose-50 text-rose-800 ring-2 ring-rose-500/30 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <XCircle className="w-4 h-4 text-rose-600" />
                  Reject / Request Revisions
                </button>
              </div>
              {errors.status && <p className="text-xs text-rose-600">{errors.status.message}</p>}
            </div>

            {/* Feedback Comment Textarea */}
            <Textarea
              label={`Reviewer Feedback Notes ${selectedStatus === SubmissionStatus.REJECTED ? '(Mandatory for rejection)' : '(Optional)'}`}
              placeholder={
                selectedStatus === SubmissionStatus.REJECTED
                  ? 'Explain clearly what requirements were missed or what needs to be fixed before re-evaluating...'
                  : 'Add praise, advice, or code quality suggestions for the student...'
              }
              rows={4}
              currentCount={commentValue.length}
              maxCount={2000}
              error={errors.comment?.message}
              {...register('comment')}
            />

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button
                type="submit"
                variant={selectedStatus === SubmissionStatus.REJECTED ? 'destructive' : 'primary'}
                className={
                  selectedStatus === SubmissionStatus.APPROVED
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                    : ''
                }
                isLoading={isSubmitting}
              >
                <Send className="w-4 h-4 mr-1.5" />
                Submit {selectedStatus === SubmissionStatus.APPROVED ? 'Approval' : 'Rejection'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Existing Feedback History */}
      {submission.feedback && submission.feedback.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-600" />
              <CardTitle className="text-base">Previous Evaluation Comments</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {submission.feedback.map((fb) => (
              <div key={fb.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900">{fb.mentor?.name || 'Mentor'}</span>
                  <span className="text-slate-500">{formatDate(fb.createdAt)}</span>
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{fb.comment}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
