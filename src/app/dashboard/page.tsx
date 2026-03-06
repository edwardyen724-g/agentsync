import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const DashboardPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/api/auth/signin'); // Redirect to Auth0 sign-in
    }
  }, [session, status, router]);

  if (status === 'loading' || !session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Transform Your AI Agents into a Seamless Workflow Machine</h1>
      <p className="mb-6">
        Welcome, {session.user?.name}! Manage all your AI agent tasks in one centralized dashboard.
      </p>
      <h2 className="text-2xl font-semibold mb-4">MVP Features</h2>
      <ul className="list-disc ml-5 space-y-2">
        <li>Centralized dashboard to view and manage all AI agent tasks in one place.</li>
        <li>Pre-built templates for common AI workflows like data entry, report generation, and notifications.</li>
        <li>Customizable automation triggers based on task completion or time schedules.</li>
        <li>Integration with popular AI tools and APIs for seamless task execution.</li>
        <li>Notification system to alert users of task completions and pending actions.</li>
      </ul>
    </div>
  );
};

export default DashboardPage;