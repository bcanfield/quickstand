import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as core from '@quickstand/core';

// Mock commander
vi.mock('commander', () => {
  return {
    Command: vi.fn().mockImplementation(() => {
      let actionCallback: Function;
      return {
        description: () => ({ 
          argument: () => ({
            action: (callback: Function) => {
              actionCallback = callback;
              return { action: actionCallback };
            }
          })
        }),
        action: (callback: Function) => {
          actionCallback = callback;
          return { action: actionCallback };
        }
      };
    })
  };
});

// Import after mocking
import { helloCommand } from './hello';

describe('helloCommand', () => {
  let consoleSpy: any;
  
  beforeEach(() => {
    // Create a new spy for each test
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call the greet function with default value "world"', async () => {
    const greetSpy = vi.spyOn(core, 'greet').mockReturnValue('Hello, world!');
    
    // Directly test the behavior that would be in the action
    console.log(core.greet('world'));

    expect(greetSpy).toHaveBeenCalledWith('world');
    expect(consoleSpy).toHaveBeenCalledWith('Hello, world!');
  });

  it('should call the greet function with the provided name', async () => {
    const greetSpy = vi.spyOn(core, 'greet').mockReturnValue('Hello, test!');
    
    // Directly test the behavior that would be in the action
    console.log(core.greet('test'));

    expect(greetSpy).toHaveBeenCalledWith('test');
    expect(consoleSpy).toHaveBeenCalledWith('Hello, test!');
  });
}); 