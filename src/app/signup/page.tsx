'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupInput } from '@/shared';
import { useAuth } from '../../providers/auth-provider';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { UserPlus, AlertCircle, Shield } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignupInput) => {
    setServerError(null);
    try {
      await signup(data);
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { message: string };
      setServerError(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <Card className="shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-2">
            <UserPlus className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Create Student Account</CardTitle>
          <CardDescription>Join ProjectFlow to submit assignments and receive mentor reviews</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Tanvir Ahmed"
              autoComplete="name"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="student@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 8 characters (letters &amp; numbers)"
              autoComplete="new-password"
              helperText="Must be 8+ characters and contain both letters and digits."
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start gap-2 text-xs text-slate-600">
              <Shield className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                Public registrations are created with the <strong>STUDENT</strong> role. Mentor accounts are assigned via system administrator credentials.
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isSubmitting}
            >
              Register Account
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center text-sm text-slate-600">
          Already registered?{' '}
          <Link href="/login" className="text-indigo-600 font-semibold hover:underline ml-1">
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
