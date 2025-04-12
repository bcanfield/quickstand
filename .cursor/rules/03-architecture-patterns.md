# Quickstand Architecture Patterns

This rule provides a quick reference to key architectural concepts. For complete details, refer to the [Architecture Guide](../../docs/architecture.md).

## Documentation References

The authoritative source for all architecture information is the [Architecture Guide](../../docs/architecture.md). This document is just a quick reference.

## Key Architectural Concepts

### Component Structure

- **CLI Package**: Command-line interface and user interaction
- **Core Package**: Core business logic, git integration, and AI services
- **TSConfig Package**: Shared TypeScript configuration

### Key Architectural Principles

1. **Command-Query Responsibility Segregation (CQRS)**
2. **Dependency Injection**
3. **Interface-Driven Development**

### Data Flow

1. User Input → CLI commands process user input
2. Command Handling → Commands delegate to core services
3. Data Collection → Services gather data
4. Data Processing → Transform raw data to domain models
5. Persistence → Store processed data
6. Presentation → Format and display results

For detailed information on implementation patterns, services, testing architecture, and other patterns, refer to the [Architecture Guide](../../docs/architecture.md). 