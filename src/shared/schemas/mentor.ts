import { z } from 'zod';
import { SubmissionStatus } from './submission';

export const reviewSubmissionSchema = z
  .object({
    status: z.enum([SubmissionStatus.APPROVED, SubmissionStatus.REJECTED], {
      errorMap: () => ({ message: 'Status must be either APPROVED or REJECTED' }),
    }),
    comment: z
      .string()
      .trim()
      .max(2000, { message: 'Comment cannot exceed 2000 characters' })
      .optional()
      .or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (data.status === SubmissionStatus.REJECTED) {
      if (!data.comment || data.comment.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['comment'],
          message: 'A constructive review comment (min 5 characters) is mandatory when rejecting a submission.',
        });
      }
    }
  });

export type ReviewSubmissionInput = z.infer<typeof reviewSubmissionSchema>;
