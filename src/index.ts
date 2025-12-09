/**
 * SQL Playground SDK
 * Browser and Node.js SDK for SQL explanation
 */

import type { ExplanationResult } from '@sql-playground/engine';

export interface ExplainOptions {
  apiUrl?: string;
  apiKey?: string;
  dialect?: 'postgres' | 'mysql' | 'sqlite';
  schema?: string;
  explainPlan?: string;
  privacyMode?: boolean;
  cache?: boolean;
}

export interface ExplainResponse {
  success: boolean;
  data?: ExplanationResult & { cached: boolean };
  error?: string;
  requestId: string;
  timestamp: string;
}

/**
 * Main SDK function: Explain SQL query
 * Works in browser (via API) and Node.js (via API or direct engine)
 */
export async function explainSQL(
  sql: string,
  options: ExplainOptions = {}
): Promise<ExplanationResult> {
  const {
    apiUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/api`
      : process.env.API_URL || 'http://localhost:3000',
    apiKey,
    dialect = 'postgres',
    schema,
    explainPlan,
    privacyMode = true,
    cache = true,
  } = options;

  const endpoint = `${apiUrl}/v1/explain`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey && { 'X-API-Key': apiKey }),
    },
    body: JSON.stringify({
      sql,
      dialect,
      schema,
      explainPlan,
      privacyMode,
      cache,
    }),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ExplainResponse;
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  const data = (await response.json()) as ExplainResponse;

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Unknown error');
  }

  return data.data;
}

/**
 * Check API health
 */
export async function checkHealth(apiUrl: string = 'http://localhost:3000'): Promise<boolean> {
  try {
    const response = await fetch(`${apiUrl}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

// Export types from engine
export * from '@sql-playground/engine';
