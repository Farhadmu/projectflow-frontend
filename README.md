# ProjectFlow — Frontend Client

> **Student Project Submission & Mentor Review Dashboard (Client Application)**  
> Built with Next.js 14 App Router, React 18, Tailwind CSS, React Hook Form, Zod, TanStack Query, and Lucide Icons.

---

## Features
- **Student Dashboard:** Submit assignments with defensive validation, live character counter, dangerous protocol rejection, and duplicate prevention.
- **Mentor Dashboard:** Server-side paginated and status-filtered submissions table, review approval/rejection forms with mandatory constructive comments, and live database metrics.
- **Role-Based Access Control (RBAC):** Route protection for `STUDENT` and `MENTOR` roles.
- **Quick Fill Evaluator Shortcuts:** 1-Click test credentials on the login screen for rapid assessor review.

---

## Setup & Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Run development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.
