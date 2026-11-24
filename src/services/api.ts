// ============================================================
// src/services/api.ts — All API calls to the Enterprise AI Gateway backend
// ============================================================

import axios from 'axios';
import type {
  AuthTokens, User, TeamUsage, DailyCost, UserUsage,
  ModelUsage, BudgetStatus, WeeklySummaryRow,
} from '@/types';

// Base URL comes from .env — set to your gateway backend URL
const BASE = import.meta.env.VITE_API_URL || '/api';

const http = axios.create({ baseURL: BASE, timeout: 30000 });

// Attach JWT on every request
http.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('monitor_access_token');
  if (token && cfg.headers) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Auto-redirect on 401
http.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('monitor_access_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ---- Auth ----
export const login = async (email: string, password: string): Promise<AuthTokens> =>
  (await http.post<AuthTokens>('/auth/login', { email, password })).data;

export const getMe = async (): Promise<User> =>
  (await http.get<User>('/auth/me')).data;

// ---- Analytics ----
export const getTeamUsage = async (days = 30): Promise<TeamUsage[]> =>
  (await http.get<TeamUsage[]>('/admin/analytics/usage-by-team', { params: { days } })).data;

export const getDailyCost = async (days = 30): Promise<DailyCost[]> =>
  (await http.get<DailyCost[]>('/admin/analytics/daily-cost', { params: { days } })).data;

export const getUserUsage = async (days = 30, limit = 50): Promise<UserUsage[]> =>
  (await http.get<UserUsage[]>('/admin/analytics/usage-by-user', { params: { days, limit } })).data;

export const getModelUsage = async (days = 30): Promise<ModelUsage[]> =>
  (await http.get<ModelUsage[]>('/admin/analytics/usage-by-model', { params: { days } })).data;

export const getBudgetStatus = async (): Promise<BudgetStatus[]> =>
  (await http.get<BudgetStatus[]>('/admin/analytics/budget-status')).data;

export const getWeeklySummary = async (weeks = 4): Promise<WeeklySummaryRow[]> =>
  (await http.get<WeeklySummaryRow[]>('/admin/analytics/weekly-summary', { params: { weeks } })).data;
