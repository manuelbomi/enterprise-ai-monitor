// Analytics response types — mirrors the FastAPI admin analytics endpoints

export interface TeamUsage {
  team_name: string;
  total_calls: number;
  total_tokens: number;
  total_cost_usd: number;
  top_model: string | null;
}

export interface DailyCost {
  date: string;        // "YYYY-MM-DD"
  cost_usd: number;
  calls: number;
}

export interface UserUsage {
  full_name: string;
  email: string;
  team_name: string;
  total_calls: number;
  total_tokens: number;
  total_cost_usd: number;
  avg_latency_ms: number;
}

export interface ModelUsage {
  model_alias: string;
  model_actual: string;
  call_count: number;
  total_tokens: number;
  prompt_tokens: number;
  completion_tokens: number;
  total_cost_usd: number;
  avg_latency_ms: number;
}

export interface BudgetStatus {
  team_id: string;
  team_name: string;
  budget_usd: number;
  spent_usd: number;
  remaining_usd: number;
  pct_used: number;
  calls_this_month: number;
  rag_status: 'green' | 'amber' | 'red';
}

export interface WeeklySummaryRow {
  team_name: string;
  week_start: string;  // "YYYY-MM-DD"
  cost_usd: number;
  total_tokens: number;
  calls: number;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
}
