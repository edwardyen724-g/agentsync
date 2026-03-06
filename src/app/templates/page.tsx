import React from "react";

const TemplatesPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Transform Your AI Agents into a Seamless Workflow Machine</h1>
      <p className="text-lg mb-6">
        Streamlined task management for your AI agents.
      </p>
      <h2 className="text-2xl font-semibold mb-4">MVP Features</h2>
      <ul className="list-disc list-inside mb-6">
        <li>Centralized dashboard to view and manage all AI agent tasks in one place.</li>
        <li>Pre-built templates for common AI workflows like data entry, report generation, and notifications.</li>
        <li>Customizable automation triggers based on task completion or time schedules.</li>
        <li>Integration with popular AI tools and APIs for seamless task execution.</li>
        <li>Notification system to alert users of task completions and pending actions.</li>
      </ul>
    </div>
  );
};

export default TemplatesPage;