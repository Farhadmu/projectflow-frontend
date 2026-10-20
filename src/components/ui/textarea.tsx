import React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  currentCount?: number;
  maxCount?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, currentCount, maxCount, id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        <div className="flex justify-between items-center">
          {label && (
            <label htmlFor={textareaId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              {label}
            </label>
          )}
          {maxCount !== undefined && (
            <span
              className={cn(
                'text-xs',
                (currentCount || 0) > maxCount ? 'text-rose-600 font-bold' : 'text-slate-400'
              )}
            >
              {currentCount || 0}/{maxCount}
            </span>
          )}
        </div>
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            'flex min-h-[96px] w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-colors',
            'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50',
            error && 'border-rose-400 focus:ring-rose-400 focus:border-rose-400',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
