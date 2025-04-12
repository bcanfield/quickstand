import { greet } from '@quickstand/core';
import { describe, expect, it, vi } from 'vitest';

// We don't need to mock Commander for these tests
vi.mock('commander', () => ({
  Command: vi.fn(() => ({
    name: vi.fn().mockReturnThis(),
    description: vi.fn().mockReturnThis(),
    addCommand: vi.fn().mockReturnThis(),
    parse: vi.fn().mockReturnThis()
  }))
}));

// Mock the commands
vi.mock('./commands', () => ({
  helloCommand: { name: 'hello' },
  formatCommand: { name: 'format' },
  standupCommand: { name: 'standup' },
  repositoryCommand: { name: 'repo' }
}));

describe('CLI', () => {
  it('should use the greet function from core package', () => {
    const name = 'Test';
    expect(greet(name)).toBe(`Hello, ${name}!`);
  });
});
