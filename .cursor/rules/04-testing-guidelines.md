# Quickstand Testing Guidelines

This rule provides a quick reference for testing practices in the Quickstand project.

## Documentation References

For complete testing guidelines, refer to:
- [Code Style Guide](../../docs/code-style-guide.md) - Testing section
- [AI Agent Guide](../../docs/ai-agent-guide.md) - Testing Guidelines section

## Quick Reference

### Test Structure

- Use Vitest as the testing framework
- Name test files with `.test.ts` suffix
- Place test files next to the source files they test
- Follow the Arrange-Act-Assert pattern

### Unit Testing Services

```typescript
import { describe, it, expect, vi } from 'vitest';
import { ServiceToTest } from './service-to-test';
import { Dependency } from './dependency';

// Mock dependencies
vi.mock('./dependency', () => ({
  Dependency: vi.fn(() => ({
    method: vi.fn().mockResolvedValue('mocked result')
  }))
}));

describe('ServiceToTest', () => {
  let service: ServiceToTest;
  
  beforeEach(() => {
    service = new ServiceToTest(new Dependency());
  });
  
  it('should perform expected action', async () => {
    // Arrange
    const input = 'test input';
    
    // Act
    const result = await service.method(input);
    
    // Assert
    expect(result).toBe('expected output');
  });
});
```

### Testing CLI Commands

```typescript
import { describe, it, expect, vi } from 'vitest';
import { Command } from 'commander';
import { createTestCommand } from './command-to-test';
import { ServiceDependency } from '@quickstand/core';

// Mock dependencies
vi.mock('@quickstand/core', () => ({
  ServiceDependency: vi.fn(() => ({
    method: vi.fn().mockResolvedValue({ result: 'success' })
  }))
}));

describe('test command', () => {
  it('should call service with correct parameters', async () => {
    // Arrange
    const command = createTestCommand();
    const mockAction = command.action as jest.Mock;
    
    // Act
    await mockAction({ option: 'value' });
    
    // Assert
    expect(ServiceDependency().method).toHaveBeenCalledWith(
      expect.objectContaining({ option: 'value' })
    );
  });
});
```

### Testing Coverage Guidelines

- Aim for high test coverage of business logic in core package
- Test all CLI commands for correct handling of options and arguments
- Test error scenarios and edge cases
- Mock external dependencies (filesystem, network, git operations)

For more detailed testing patterns and examples, refer to the documentation linked above. 