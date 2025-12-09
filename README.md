# SQL Playground SDK

[![npm](https://img.shields.io/npm/v/@sql-playground/sdk)](https://www.npmjs.com/package/@sql-playground/sdk)

Browser and Node.js SDK for SQL Playground. Call the API with a single function.

## Installation

```bash
npm install @sql-playground/sdk
```

## Usage

### Browser

```typescript
import { explainSQL } from '@sql-playground/sdk';

async function explainMyQuery() {
  const result = await explainSQL(
    'SELECT u.id, u.name FROM users u WHERE u.active = true',
    {
      dialect: 'postgres',
      apiUrl: 'https://api.sql-playground.dev',
      privacyMode: true,
    }
  );

  console.log(result.summary);
  // "Find active users"
  console.log(result.optimizations);
  // Array of optimization suggestions
}
```

### Node.js

```typescript
import { explainSQL } from '@sql-playground/sdk';

const explanation = await explainSQL(
  'SELECT * FROM orders WHERE created_at > NOW() - INTERVAL 1 DAY',
  {
    apiUrl: 'http://localhost:3000',
    apiKey: process.env.SQL_PLAYGROUND_API_KEY,
    dialect: 'postgres',
  }
);

console.log(explanation);
```

## API

### `explainSQL(sql, options?)`

Explain a SQL query.

**Parameters:**

- `sql` (string) — SQL query to explain
- `options` (ExplainOptions) — Configuration:
  - `apiUrl` (string) — API endpoint (default: `http://localhost:3000` or current origin)
  - `apiKey` (string) — API key for authentication
  - `dialect` ('postgres' | 'mysql' | 'sqlite') — SQL dialect (default: 'postgres')
  - `schema` (string) — Schema definition for context
  - `explainPlan` (string) — EXPLAIN output to analyze
  - `privacyMode` (boolean) — Strip literals before sending to LLM (default: true)
  - `cache` (boolean) — Use cached results if available (default: true)

**Returns:** Promise<ExplanationResult>

**Example:**

```typescript
const result = await explainSQL(
  'SELECT * FROM users WHERE email = ? AND status = ?',
  {
    dialect: 'mysql',
    schema: 'users(id, email, status, created_at)',
    privacyMode: true,
  }
);

console.log(result.summary);        // Human-readable summary
console.log(result.walkthrough);    // Step-by-step breakdown
console.log(result.optimizations);  // Suggestions
console.log(result.confidence);     // "low" | "medium" | "high"
```

### `checkHealth(apiUrl?)`

Check if API is available.

```typescript
const isHealthy = await checkHealth('http://localhost:3000');
```

## Exported Types

All types from `@sql-playground/engine` are re-exported:

```typescript
export type {
  ExplanationResult,
  PlanNode,
  Optimization,
  AntiPattern,
  QueryFingerprint,
  SQLDialect,
  SchemaSummary,
};
```

## Browser Support

Works in all modern browsers that support:

- `fetch` API
- ES2020+

For older browsers, use a polyfill or bundle with appropriate transpilation.

## Error Handling

```typescript
try {
  const result = await explainSQL('SELECT...');
} catch (error) {
  if (error instanceof Error) {
    console.error('Failed to explain:', error.message);
  }
}
```

## Development

```bash
npm install
npm run build       # Build ESM + CJS
npm test           # Run tests
npm run lint       # Lint code
npm run format     # Format code
```

## License

MIT

## Contributing

Issues and PRs welcome at: https://github.com/sql-playground/sql-playground-sdk
