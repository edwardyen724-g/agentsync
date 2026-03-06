import React from 'react';
import { SessionProvider } from 'next-auth/react';
import './globals.css'; // Global styles with Tailwind CSS
import Head from 'next/head';

export const metadata = {
  title: 'AgentSync | Streamlined Task Management for Your AI Agents',
  description: 'Transform Your AI Agents into a Seamless Workflow Machine',
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
};

export default Layout;