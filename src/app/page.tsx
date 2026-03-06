import React from "react";
import Link from "next/link";

const HomePage: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-4xl font-bold text-center text-blue-600">
        Transform Your AI Agents into a Seamless Workflow Machine
      </h1>
      <p className="mt-4 text-lg text-center text-gray-700">
        Streamlined task management for your AI agents.
      </p>
      <div className="mt-8 max-w-3xl w-full">
        <h2 className="text-2xl font-semibold text-gray-800">MVP Features</h2>
        <ul className="mt-4 space-y-2 list-disc list-inside">
          <li>Centralized dashboard to view and manage all AI agent tasks in one place.</li>
          <li>Pre-built templates for common AI workflows like data entry, report generation, and notifications.</li>
          <li>Customizable automation triggers based on task completion or time schedules.</li>
          <li>Integration with popular AI tools and APIs for seamless task execution.</li>
          <li>Notification system to alert users of task completions and pending actions.</li>
        </ul>
      </div>
      <Link href="/signup" className="mt-8 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Get Started
      </Link>
    </main>
  );
};

export default HomePage;