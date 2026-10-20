import React from 'react';
import { SubmissionStatus } from '@/shared';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatusBadgeProps {
  status: SubmissionStatus | string;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  switch (status) {
    case SubmissionStatus.APPROVED:
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm',
            className
          )}
        >
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
          Approved
        </span>
      );
    case SubmissionStatus.REJECTED:
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 shadow-sm',
            className
          )}
        >
          {showIcon && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
          Rejected
        </span>
      );
    case SubmissionStatus.PENDING:
    default:
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-sm',
            className
          )}
        >
          {showIcon && <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />}
          Pending Review
        </span>
      );
  }
}
