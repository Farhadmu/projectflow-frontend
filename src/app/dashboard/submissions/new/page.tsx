'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { createSubmissionSchema, CreateSubmissionInput } from '@/shared';
import { apiRequest } from '../../../../lib/api';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Textarea } from '../../../../components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../../components/ui/card';
import { Send, ArrowLeft, AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react';

export default function NewSubmissionPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateSubmissionInput>({
    resolver: zodResolver(createSubmissionSchema),
    mode: 'onChange', // Instant feedback on change
    defaultValues: {
      projectName: '',
      repoUrl: '',
      liveUrl: '',
      description: '',
    },
  });

  const descriptionValue = watch('description') || '';

  const onSubmit = async (data: CreateSubmissionInput) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      const res = await apiRequest('/submissions', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      setSuccessMessage('Project successfully submitted! Redirecting to your dashboard...');
      await queryClient.invalidateQueries({ queryKey: ['my-submissions'] });

      setTimeout(() => {
        router.push('/dashboard/submissions');
      }, 1200);
    } catch (err: unknown) {
      const error = err as { message: string; code?: string };
      if (error.code === 'DUPLICATE_SUBMISSION') {
        setServerError(
          'Duplicate Submission: You have already submitted this repository. If you made updates, please commit to your existing GitHub repo.'
        );
      } else {
        setServerError(error.message || 'Failed to submit project. Please verify all fields.');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/submissions">
          <Button size="sm" variant="outline" className="gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            Back to Submissions
          </Button>
        </Link>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Submit Project for Mentor Review</CardTitle>
              <CardDescription>
                Provide verified GitHub repository and live deployment links for evaluation.
              </CardDescription>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full font-semibold border border-indigo-100">
              <ShieldAlert className="w-3.5 h-3.5" />
              Defensive Validation
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError && (
              <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                <div className="space-y-1">
                  <p className="font-semibold">Submission Notice</p>
                  <p className="text-xs text-rose-600 leading-relaxed">{serverError}</p>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-700 text-sm">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                <span className="font-semibold">{successMessage}</span>
              </div>
            )}

            <Input
              label="Project Title"
              placeholder="e.g. ProjectFlow - Student Submission Dashboard"
              helperText="Clear, professional name for your assignment project."
              error={errors.projectName?.message}
              {...register('projectName')}
            />

            <Input
              label="GitHub Repository URL"
              type="url"
              placeholder="https://github.com/your-username/your-repository"
              helperText="Must be an accessible GitHub repository URL starting with https://github.com/..."
              error={errors.repoUrl?.message}
              {...register('repoUrl')}
            />

            <Input
              label="Live Deployment URL"
              type="url"
              placeholder="https://your-project.vercel.app"
              helperText="Active, publicly deployed web application link (http:// or https://)."
              error={errors.liveUrl?.message}
              {...register('liveUrl')}
            />

            <Textarea
              label="Project Description &amp; Technical Highlights"
              placeholder="Briefly describe what this project does, key technical architecture, technologies used, and any special instructions for the reviewer..."
              rows={4}
              currentCount={descriptionValue.length}
              maxCount={2000}
              helperText="Min 10 characters, max 2000 characters."
              error={errors.description?.message}
              {...register('description')}
            />

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-100">
              <Link href="/dashboard/submissions" className="w-full sm:w-auto">
                <Button type="button" variant="ghost" className="w-full sm:w-auto">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                className="w-full sm:w-auto"
                isLoading={isSubmitting}
                disabled={!isValid || isSubmitting}
              >
                <Send className="w-4 h-4 mr-1.5" />
                Submit Assignment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
