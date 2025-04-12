# Project Guidelines

This document outlines the standards and practices for developing TypeScript projects, ensuring consistency and adherence to modern development principles, including SOLID and Test-Driven Development (TDD).

## Table of Contents

1. [Project Structure](#project-structure)
2. [Coding Standards](#coding-standards)
3. [SOLID Principles](#solid-principles)
4. [Test-Driven Development](#test-driven-development)
5. [Documentation](#documentation)

## 1. Project Structure

This project is a monorepo utilizing pnpm workspaces and Turborepo.

The project is organized as follows

- **`/docs`**: Contains markdown documents instructing developers and AI Agents
- **`/packages`**: Contains individual packages in the monorepo
- **`/packages/cli`**: Package containing the Command Line Interface (CLI) portion of the tool
- **`/packages/core`**: Package containing the core functionality of the tool
- **`/packages/tsconfig`**: Package containing the shared typescript configuration of all other packages

### Within a Package
- **`/src`**: Contains the source code, organized into `services`, `utils`, and `types`.
- **`/dist`**: Outputs compiled JavaScript files.

This structure promotes modularity and maintainability.

## 2. Coding Standards

- **Consistent Naming**: Use clear and descriptive names for variables, functions, and classes.
- **Type Annotations**: Explicitly define types for function parameters and return values to leverage TypeScript's static typing.
- **Linting and Formatting**: Utilize Biome to enforce coding standards and maintain code consistency.
    - `pnpm lint:fix` Runs formatter, linter and import sorting to the project's typescript files and writes safe fixes.
    - `pnpm type-check` Runs type checking on project.

## 3. SOLID Principles

Adhere to the SOLID principles to create robust and maintainable code:

1. **Single Responsibility Principle**: Ensure each class or module has one responsibility.
2. **Open/Closed Principle**: Design modules that are open for extension but closed for modification.
3. **Liskov Substitution Principle**: Subtypes must be substitutable for their base types without altering the correctness of the program.
4. **Interface Segregation Principle**: Create specific interfaces rather than a single general-purpose interface.
5. **Dependency Inversion Principle**: Depend on abstractions, not on concrete implementations.

Applying these principles enhances code flexibility and testability

## 4. Test-Driven Development

Implement TDD by following the Red-Green-Refactor cycle:

1. **Red**: Write a failing test that defines a desired improvement or function.
2. **Green**: Write the minimum amount of code necessary to pass the test.
3. **Refactor**: Optimize the code while ensuring that all tests continue to pass.

Use Vitest as the testing framework:

- **Unit Tests**: Test individual functions. Test files should be co-located next to the file it's testing.

This approach ensures code reliability and facilitates refactoring.


## 5. Documentation

- **Code Comments**: Provide clear comments for complex logic and decisions.
- **Markdown docs**: Files in the `docs` directory are to instruct agents and developers how to properly work in this repository such as project setup instructions, usage guidelines, and contribution protocols.. Ensure these stay up to date, as well as  `README.md` , which should be much more brief but give an overview of the repo at a glance. 
- **API Documentation**: Use tools like TypeDoc to generate documentation from TypeScript comments.

By following these guidelines, developers can collaborate effectively, maintain high code quality, and build scalable TypeScript applications.


