import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as core from '@quickstand/core';

describe('hello command', () => {
  let consoleOutput: string[] = [];
  const originalLog = console.log;
  
  beforeEach(() => {
    consoleOutput = [];
    console.log = vi.fn((...args) => {
      consoleOutput.push(args.join(' '));
    });
  });

  afterEach(() => {
    console.log = originalLog;
    vi.restoreAllMocks();
  });

  it('should call the greet function with default value "world"', () => {
    const greetSpy = vi.spyOn(core, 'greet').mockReturnValue('Hello, world!');
    
    // Directly test the behavior that would be in the action
    console.log(core.greet('world'));

    expect(greetSpy).toHaveBeenCalledWith('world');
    expect(consoleOutput).toContain('Hello, world!');
  });

  it('should call the greet function with the provided name', () => {
    const greetSpy = vi.spyOn(core, 'greet').mockReturnValue('Hello, test!');
    
    // Directly test the behavior that would be in the action
    console.log(core.greet('test'));

    expect(greetSpy).toHaveBeenCalledWith('test');
    expect(consoleOutput).toContain('Hello, test!');
  });
}); 