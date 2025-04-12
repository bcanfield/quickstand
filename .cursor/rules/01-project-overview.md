# Quickstand Project Overview

This is a CLI tool that helps developers create status updates by managing git logs across multiple repositories and leveraging AI for content generation.

## Primary Features

- Fetch and organize git logs across multiple repositories
- Manage "standup" entries (collections of activity over time periods)
- Generate human-readable status updates using AI

## Documentation References

For all project information, please refer to the documentation in the `docs` directory:

- [Project Guidelines](../../docs/project-guidelines.md) - Overall project standards and practices
- [Getting Started](../../docs/getting-started.md) - Setup and basic usage guide
- [Architecture Guide](../../docs/architecture.md) - Architecture and design patterns
- [Code Style Guide](../../docs/code-style-guide.md) - Coding standards and patterns
- [AI Agent Guide](../../docs/ai-agent-guide.md) - Specific guidelines for AI agents

## Repository Structure

This is a monorepo with the following structure:

```
quickstand/
├── packages/
│   ├── cli/               # Command-line interface
│   ├── core/              # Core functionality 
│   └── tsconfig/          # Shared TypeScript configuration
└── docs/                  # Documentation - single source of truth
```

When working on this project, always follow the guidelines specified in the documentation. 