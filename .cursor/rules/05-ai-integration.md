# Quickstand AI Integration Guidelines

This rule provides a quick reference for AI integration practices in the Quickstand project.

## Documentation References

For complete AI integration guidelines, refer to:
- [Architecture Guide](../../docs/architecture.md) - AI Integration Architecture section
- [AI Agent Guide](../../docs/ai-agent-guide.md) - AI Integration section

## Quick Reference

### AI Service Structure

The AI integration follows these principles:

1. **Abstraction**: Use interfaces to hide implementation details of AI providers
2. **Templating**: Use prompt templates for consistent AI interactions
3. **Type Safety**: Implement structured responses with validation
4. **Fallbacks**: Include graceful degradation when AI services are unavailable

### AI Service Pattern

```typescript
// Define interface first
interface AIService {
  generateStatusUpdate(standup: Standup, options: AIOptions): Promise<string>;
  summarizeCommits(commits: GitCommit[]): Promise<string>;
}

// Implementation for specific provider
export class OpenAIService implements AIService {
  constructor(
    private readonly apiKey: string,
    private readonly promptTemplates: PromptTemplateManager
  ) {}
  
  async generateStatusUpdate(standup: Standup, options: AIOptions): Promise<string> {
    try {
      const prompt = this.promptTemplates.getStatusUpdatePrompt(standup, options);
      const response = await this.callOpenAI(prompt);
      return this.processResponse(response);
    } catch (error) {
      // Fallback to template-based generation
      return this.generateBasicStatusUpdate(standup);
    }
  }
  
  // Other methods
}
```

### Prompt Templates

Store prompt templates separately to maintain consistency and allow for easy updates:

```typescript
export class PromptTemplateManager {
  private templates = {
    statusUpdate: `
      Generate a status update based on the following git commits:
      {{commits}}
      
      Format the update as a concise summary of work done,
      grouped by category (features, fixes, refactoring).
    `,
    // Other templates
  };
  
  getStatusUpdatePrompt(standup: Standup, options: AIOptions): string {
    return this.templates.statusUpdate
      .replace('{{commits}}', this.formatCommits(standup.items))
      // Other replacements
  }
  
  // Other methods
}
```

### Data Privacy Considerations

- Don't send sensitive information to external AI services
- Sanitize commit messages before sending to AI
- Provide options for users to review data before sending to AI

For more detailed information on AI integration patterns, refer to the documentation linked above. 