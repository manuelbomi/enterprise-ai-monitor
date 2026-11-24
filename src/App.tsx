// ============================================================
// App.tsx — Root router for Enterprise AI Monitor.
//
// Auth guard pattern:
//   • /login  — public, redirects to / if already logged in
//   • /*      — protected, redirects to /login if no token
//
// Token validation is intentionally lightweight here (presence
// check only). The axios interceptor in api.ts catches a stale
// or expired token on the first API call and redirects to /login.
// ============================================================

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Layout }           from '@/pages/Layout';
import { LoginPage }        from '@/pages/LoginPage';
import { OverviewPage }     from '@/pages/OverviewPage';
import { ByTeamPage }       from '@/pages/ByTeamPage';
import { ByUserPage }       from '@/pages/ByUserPage';
import { ByModelPage }      from '@/pages/ByModelPage';
import { BudgetStatusPage } from '@/pages/BudgetStatusPage';
import { WeeklyReportPage } from '@/pages/WeeklyReportPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min — analytics data doesn't need live refresh
      retry: 1,
    },
  },
});

// Protected route — renders children only if a token exists in localStorage
const Guard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('monitor_access_token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public route — redirects logged-in users away from /login
const Public: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('monitor_access_token');
  return token ? <Navigate to="/" replace /> : <>{children}</>;
};

export const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Public><LoginPage /></Public>} />

        {/* Protected — all pages inside the shared Layout shell */}
        <Route path="/" element={<Guard><Layout /></Guard>}>
          <Route index                  element={<OverviewPage />} />
          <Route path="by-team"         element={<ByTeamPage />} />
          <Route path="by-user"         element={<ByUserPage />} />
          <Route path="by-model"        element={<ByModelPage />} />
          <Route path="budget"          element={<BudgetStatusPage />} />
          <Route path="weekly-report"   element={<WeeklyReportPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);
