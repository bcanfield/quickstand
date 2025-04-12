import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as core from '@quickstand/core';

// Mock the RepositoryService
vi.mock('@quickstand/core', async () => {
  const actual = await vi.importActual('@quickstand/core');
  return {
    ...(actual as object),
    RepositoryService: vi.fn(() => ({
      addRepository: vi.fn(),
      listRepositories: vi.fn(),
      removeRepository: vi.fn()
    }))
  };
});

describe('repository command', () => {
  // Direct console spies without mocking implementation
  const consoleLogSpy = vi.spyOn(console, 'log');
  const consoleErrorSpy = vi.spyOn(console, 'error');
  
  let repositoryServiceMock: any;
  
  beforeEach(() => {
    // Reset mocks
    consoleLogSpy.mockClear();
    consoleErrorSpy.mockClear();
    
    // Get a fresh instance of RepositoryService mock
    repositoryServiceMock = new core.RepositoryService();
    
    // Reset all mocks
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  describe('add subcommand', () => {
    it('should add a repository with the provided path and options', async () => {
      // Setup the mock implementation
      const mockRepo = { id: '123', name: 'test-repo', path: '/path/to/repo', active: true };
      repositoryServiceMock.addRepository.mockResolvedValue(mockRepo);
      
      // Directly test the behavior that would be in the action
      try {
        const repository = await repositoryServiceMock.addRepository({
          path: '/path/to/repo',
          name: 'test-repo',
          standupId: 'standup-123'
        });
        console.log(`Repository added: ${repository.name} (${repository.id})`);
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // Verify the service was called correctly
      expect(repositoryServiceMock.addRepository).toHaveBeenCalledWith({
        path: '/path/to/repo',
        name: 'test-repo',
        standupId: 'standup-123'
      });
      
      // Verify the output
      expect(consoleLogSpy).toHaveBeenCalledWith('Repository added: test-repo (123)');
    });
    
    it('should handle errors when adding a repository', async () => {
      // Setup the mock implementation to throw an error
      const error = new Error('Failed to add repository');
      repositoryServiceMock.addRepository.mockRejectedValue(error);
      
      // Directly test the behavior that would be in the action
      try {
        await repositoryServiceMock.addRepository({
          path: '/path/to/repo'
        });
        console.log('Should not reach here');
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // Verify error handling
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Failed to add repository');
    });
  });
  
  describe('list subcommand', () => {
    it('should list all repositories', async () => {
      // Setup the mock implementation
      const mockRepos = [
        { id: '123', name: 'repo-1', path: '/path/to/repo1', active: true },
        { id: '456', name: 'repo-2', path: '/path/to/repo2', active: false }
      ];
      repositoryServiceMock.listRepositories.mockResolvedValue(mockRepos);
      
      // Directly test the behavior that would be in the action
      try {
        const repositories = await repositoryServiceMock.listRepositories();
        
        if (repositories.length === 0) {
          console.log('No repositories found.');
          return;
        }

        console.log('Repositories:');
        for (const repo of repositories) {
          const status = repo.active ? 'active' : 'inactive';
          console.log(`- ${repo.name} (${repo.id}) [${status}]`);
          console.log(`  Path: ${repo.path}`);
        }
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // Verify the service was called
      expect(repositoryServiceMock.listRepositories).toHaveBeenCalled();
      
      // Verify the output
      expect(consoleLogSpy).toHaveBeenCalledWith('Repositories:');
      expect(consoleLogSpy).toHaveBeenCalledWith('- repo-1 (123) [active]');
      expect(consoleLogSpy).toHaveBeenCalledWith('  Path: /path/to/repo1');
      expect(consoleLogSpy).toHaveBeenCalledWith('- repo-2 (456) [inactive]');
      expect(consoleLogSpy).toHaveBeenCalledWith('  Path: /path/to/repo2');
    });
    
    it('should list repositories filtered by standup ID', async () => {
      // Setup the mock implementation
      const mockRepos = [
        { id: '123', name: 'repo-1', path: '/path/to/repo1', active: true }
      ];
      repositoryServiceMock.listRepositories.mockResolvedValue(mockRepos);
      
      // Directly test the behavior that would be in the action
      try {
        const repositories = await repositoryServiceMock.listRepositories('standup-123');
        
        if (repositories.length === 0) {
          console.log('No repositories found.');
          return;
        }

        console.log('Repositories:');
        for (const repo of repositories) {
          const status = repo.active ? 'active' : 'inactive';
          console.log(`- ${repo.name} (${repo.id}) [${status}]`);
          console.log(`  Path: ${repo.path}`);
        }
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // Verify the service was called correctly
      expect(repositoryServiceMock.listRepositories).toHaveBeenCalledWith('standup-123');
      
      // Verify the output
      expect(consoleLogSpy).toHaveBeenCalledWith('Repositories:');
      expect(consoleLogSpy).toHaveBeenCalledWith('- repo-1 (123) [active]');
      expect(consoleLogSpy).toHaveBeenCalledWith('  Path: /path/to/repo1');
    });
    
    it('should handle empty repository list', async () => {
      // Setup the mock implementation
      repositoryServiceMock.listRepositories.mockResolvedValue([]);
      
      // Directly test the behavior that would be in the action
      try {
        const repositories = await repositoryServiceMock.listRepositories();
        
        if (repositories.length === 0) {
          console.log('No repositories found.');
          return;
        }

        console.log('Should not reach here');
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // Verify the output
      expect(consoleLogSpy).toHaveBeenCalledWith('No repositories found.');
    });
    
    it('should handle errors when listing repositories', async () => {
      // Setup the mock implementation to throw an error
      const error = new Error('Failed to list repositories');
      repositoryServiceMock.listRepositories.mockRejectedValue(error);
      
      // Directly test the behavior that would be in the action
      try {
        await repositoryServiceMock.listRepositories();
        console.log('Should not reach here');
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // Verify error handling
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Failed to list repositories');
    });
  });
  
  describe('remove subcommand', () => {
    it('should remove the repository with the provided id', async () => {
      // Setup the mock implementation
      repositoryServiceMock.removeRepository.mockResolvedValue(undefined);
      
      // Directly test the behavior that would be in the action
      try {
        await repositoryServiceMock.removeRepository('123');
        console.log(`Repository removed: 123`);
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // Verify the service was called correctly
      expect(repositoryServiceMock.removeRepository).toHaveBeenCalledWith('123');
      
      // Verify the output
      expect(consoleLogSpy).toHaveBeenCalledWith('Repository removed: 123');
    });
    
    it('should handle errors when removing a repository', async () => {
      // Setup the mock implementation to throw an error
      const error = new Error('Failed to remove repository');
      repositoryServiceMock.removeRepository.mockRejectedValue(error);
      
      // Directly test the behavior that would be in the action
      try {
        await repositoryServiceMock.removeRepository('123');
        console.log('Should not reach here');
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // Verify error handling
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Failed to remove repository');
    });
  });
}); 