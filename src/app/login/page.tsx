'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput, UserRole } from '@/shared';
import { useAuth } from '../../providers/auth-provider';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    try {
      const user = await login(data);
      if (user.role === UserRole.MENTOR) {
        router.push('/mentor/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      const error = err as { message: string };
      setServerError(error.message || 'Login failed. Please check your credentials.');
    }
  };

  const fillCredentials = (role: 'student' | 'mentor') => {
    if (role === 'mentor') {
      setValue('email', 'mentor@projectflow.dev', { shouldValidate: true });
      setValue('password', 'MentorSecurePassword123!', { shouldValidate: true });
    } else {
      setValue('email', 'student@projectflow.dev', { shouldValidate: true });
      setValue('password', 'StudentSecurePassword123!', { shouldValidate: true });
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <Card className="shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your ProjectFlow dashboard</CardDescription>
        </CardHeader>

        {/* 1-Click Fill Buttons for Assessor */}
        <div className="px-6 py-2.5 bg-slate-50 border-y border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span className="flex items-center gap-1 font-semibold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Quick Fill:
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('student')}
              className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium transition-colors"
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('mentor')}
              className="px-2 py-1 rounded bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 font-medium transition-colors"
            >
              Demo Mentor
            </button>
          </div>
        </div>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isSubmitting}
            >
              Sign In
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center text-sm text-slate-600">
          Don&apos;t have an account yet?{' '}
          <Link href="/signup" className="text-indigo-600 font-semibold hover:underline ml-1">
            Sign up as Student
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
