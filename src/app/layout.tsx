import type { Metadata } from 'next';
import './globals.css';
import { ReactQueryProvider } from '../providers/query-provider';
import { AuthProvider } from '../providers/auth-provider';
import { Navbar } from '../components/ui/navbar';

export const metadata: Metadata = {
  title: 'ProjectFlow | Student Project Submission & Mentor Review Dashboard',
  description:
    'A production-grade full-stack platform for students to submit repositories and mentors to securely review, evaluate, and provide feedback.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <ReactQueryProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <footer className="border-t border-slate-200/80 bg-white py-6 mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
                ProjectFlow &bull; Programming Hero Associate Web Instructor Hiring Assessment &bull; TypeScript, Next.js, Express, PostgreSQL, Prisma
              </div>
            </footer>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
