import { UserRole } from '../schemas/auth';
import { SubmissionStatus } from '../schemas/submission';

export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponseData {
  user: AuthUser;
  token?: string; // Optional if cookie-based or bearer
}

export interface FeedbackDto {
  id: string;
  submissionId: string;
  mentorId: string;
  mentor?: {
    id: string;
    name: string;
    email: string;
  };
  comment: string;
  createdAt: string;
}

export interface SubmissionDto {
  id: string;
  projectName: string;
  repoUrl: string;
  normalizedRepoUrl?: string;
  liveUrl: string;
  description: string;
  status: SubmissionStatus;
  studentId: string;
  student?: {
    id: string;
    name: string;
    email: string;
  };
  reviewedById?: string | null;
  reviewer?: {
    id: string;
    name: string;
    email: string;
  } | null;
  reviewedAt?: string | null;
  feedback?: FeedbackDto[];
  createdAt: string;
  updatedAt: string;
}

export interface MentorStats {
  totalSubmissions: number;
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
}
