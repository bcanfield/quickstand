# Quickstand Architecture Patterns

This rule provides a quick reference to the architectural patterns used in the Quickstand project.

## Documentation References

For complete architecture guidelines, refer to the [Architecture Guide](../../docs/architecture.md).

## Quick Reference

### Component Structure

- **CLI Package**: Command-line interface and user interaction
- **Core Package**: Core business logic, git integration, and AI services
- **TSConfig Package**: Shared TypeScript configuration

### Key Architectural Principles

1. **Command-Query Responsibility Segregation (CQRS)**
   - Commands: Operations that change state
   - Queries: Operations that return data

2. **Dependency Injection**
   - Services should receive dependencies through constructor injection
   - This improves testability and modularity

3. **Interface-Driven Development**
   - Define interfaces before implementations
   - Use interfaces to define contracts between components

### Service Pattern

Services should follow this pattern:

```typescript
// Define interface first
interface ServiceInterface {
  methodName(param: ParamType): Promise<ReturnType>;
}

// Implement interface
export class ServiceImplementation implements ServiceInterface {
  constructor(
    private readonly dependency1: Dependency1,
    private readonly dependency2: Dependency2
  ) {}
  
  async methodName(param: ParamType): Promise<ReturnType> {
    // Implementation
  }
}
```

### Data Flow

The data flow follows this pattern:

1. User Input → CLI commands process user input
2. Command Handling → Commands delegate to core services
3. Data Collection → Services gather data
4. Data Processing → Transform raw data to domain models
5. Persistence → Store processed data
6. Presentation → Format and display results

For detailed information on subsystems, testing architecture, and other patterns, refer to the [Architecture Guide](../../docs/architecture.md). 