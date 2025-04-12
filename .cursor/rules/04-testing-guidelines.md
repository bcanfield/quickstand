# Quickstand Testing Guidelines

This rule provides a quick reference to key testing concepts. For complete details, refer to the documentation.

## Documentation References

All testing guidelines are found in:
- [Code Style Guide](../../docs/code-style-guide.md) - Testing section
- [AI Agent Guide](../../docs/ai-agent-guide.md) - Testing Guidelines section

## Key Testing Principles

- Use Vitest as the testing framework
- Name test files with `.test.ts` suffix
- Place test files next to the source files they test
- Follow the Arrange-Act-Assert pattern
- Mock external dependencies
- Test both happy paths and error cases
- Aim for high test coverage of business logic

For detailed examples, patterns, and implementation details for testing services, CLI commands, and handling edge cases, refer to the documentation linked above. 