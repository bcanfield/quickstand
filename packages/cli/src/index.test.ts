import { describe, it, expect, vi } from 'vitest';
import { greet } from '@quickstand/core';

describe('CLI', () => {
  it('should use the greet function from core package', () => {
    const name = 'Test';
    const result = greet(name);
    expect(result).toBe(`Hello, ${name}!`);
  });

  it('should format greetings correctly', () => {
    const result = greet('World');
    expect(result).toBe('Hello, World!');
  });
});
