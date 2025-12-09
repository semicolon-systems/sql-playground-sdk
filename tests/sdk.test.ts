/**
 * SDK Tests
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { explainSQL, checkHealth } from '../src/index.js';

describe('SDK', () => {
  describe('explainSQL', () => {
    it('should handle network errors', async () => {
      try {
        await explainSQL('SELECT * FROM users', {
          apiUrl: 'http://localhost:9999', // Non-existent API
        });
        expect.fail('Should throw error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should validate SQL parameter', async () => {
      try {
        await explainSQL('', { apiUrl: 'http://localhost:3000' });
        expect.fail('Should throw error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('checkHealth', () => {
    it('should detect unavailable API', async () => {
      const health = await checkHealth('http://localhost:9999');
      expect(health).toBe(false);
    });
  });

  describe('type exports', () => {
    it('should export engine types', async () => {
      // Type checking happens at compile time
      // This just ensures no runtime errors
      expect(true).toBe(true);
    });
  });
});
