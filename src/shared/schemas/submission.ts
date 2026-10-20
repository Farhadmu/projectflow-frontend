import { z } from 'zod';

export const SubmissionStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export type SubmissionStatus = (typeof SubmissionStatus)[keyof typeof SubmissionStatus];

const urlRegex = /^https?:\/\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+$/;
const githubRepoRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(\/)?$/i;

export const createSubmissionSchema = z.object({
  projectName: z
    .string({ required_error: 'Project name is required' })
    .trim()
    .min(3, { message: 'Project name must be at least 3 characters' })
    .max(120, { message: 'Project name cannot exceed 120 characters' }),
  repoUrl: z
    .string({ required_error: 'GitHub repository URL is required' })
    .trim()
    .regex(urlRegex, { message: 'Must be a valid HTTP or HTTPS URL' })
    .regex(githubRepoRegex, {
      message: 'Must be a valid GitHub repository URL (e.g. https://github.com/username/project)',
    })
    .max(255, { message: 'Repository URL is too long' }),
  liveUrl: z
    .string({ required_error: 'Live deployment URL is required' })
    .trim()
    .max(255, { message: 'Live URL is too long' })
    .regex(urlRegex, { message: 'Must be a valid HTTP or HTTPS URL' })
    .refine(
      (val) => {
        try {
          const parsed = new URL(val);
          return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch {
          return false;
        }
      },
      { message: 'Live URL must have http:// or https:// protocol' }
    ),
  description: z
    .string({ required_error: 'Project description is required' })
    .trim()
    .min(10, { message: 'Description must be at least 10 characters long' })
    .max(2000, { message: 'Description cannot exceed 2000 characters' }),
});

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;

export const submissionQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  status: z.nativeEnum(SubmissionStatus).or(z.literal('ALL')).default('ALL'),
  search: z.string().trim().max(100).optional(),
});

export type SubmissionQueryInput = z.infer<typeof submissionQuerySchema>;
