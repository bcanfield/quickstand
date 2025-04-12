# Quickstand Code Standards for AI Code Generation

When generating code for the Quickstand project, follow these guidelines:

## Documentation References

For complete code style guidelines, refer to the [Code Style Guide](../../docs/code-style-guide.md).

## Quick Reference

- Use TypeScript with explicit type annotations
- Follow CLI-specific patterns for command structure
- Use dependency injection for services
- Place test files next to source files with `.test.ts` extension
- Organize imports in groups: built-in modules, external dependencies, internal modules

## TypeScript Usage

```typescript
// GOOD: Use explicit type annotations
function processGitLogs(logs: GitLogEntry[]): StandupItem[] {
  // Implementation
}

// BAD: Missing type annotations
function processGitLogs(logs) {
  // Implementation
}
```

## CLI Command Pattern

Commands should be structured using Commander.js as shown in these examples:

```typescript
// Example command structure
export function createCommandName(program: Command): void {
  program
    .command('command-name')
    .description('Description of what the command does')
    .option('-o, --option <value>', 'Description of option')
    .action(async (options) => {
      // Delegate to service in core package
    });
}
```

## Error Handling

Always implement proper error handling, especially for CLI commands:

```typescript
try {
  // Operation that might fail
} catch (error) {
  if (error instanceof GitOperationError) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  } else {
    console.error(chalk.red('An unexpected error occurred'));
    console.error(error);
    process.exit(1);
  }
}
```

For detailed examples and patterns, always refer to the [Code Style Guide](../../docs/code-style-guide.md) and [Architecture Guide](../../docs/architecture.md). 