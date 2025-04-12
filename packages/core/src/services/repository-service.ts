import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Repository, RepositoryOptions } from '../types';
import { 
  isGitRepository, 
  getRepositoryName,
  loadConfig, 
  saveConfig,
  InvalidRepositoryError,
  RepositoryExistsError,
  RepositoryNotFoundError,
  StandupNotFoundError 
} from '../utils';

/**
 * Service for managing repositories
 */
export class RepositoryService {
  /**
   * Adds a new repository
   */
  async addRepository(options: RepositoryOptions): Promise<Repository> {
    // Normalize and resolve the repository path
    const repoPath = path.resolve(options.path);
    
    // Verify it's a valid git repository
    const isGitRepo = await isGitRepository(repoPath);
    if (!isGitRepo) {
      throw new InvalidRepositoryError(repoPath);
    }
    
    // Load current configuration
    const config = await loadConfig();
    
    // Check if a repository with this path already exists
    const existingRepo = Object.values(config.repositories).find(
      (repo) => path.resolve(repo.path) === repoPath
    );
    
    if (existingRepo) {
      throw new RepositoryExistsError(repoPath);
    }
    
    // Generate repository name if not provided
    const repoName = options.name || await getRepositoryName(repoPath);
    
    // Create new repository
    const repository: Repository = {
      id: uuidv4(),
      path: repoPath,
      name: repoName,
      active: true
    };
    
    // Add to config
    config.repositories[repository.id] = repository;
    
    // If standupId is provided, add repository to that standup
    if (options.standupId) {
      const standup = config.standups[options.standupId];
      if (!standup) {
        throw new StandupNotFoundError(options.standupId);
      }
      
      // Add repository to standup if not already added
      if (!standup.repositories.includes(repository.id)) {
        standup.repositories.push(repository.id);
        standup.updatedAt = new Date().toISOString();
      }
    }
    
    // Save configuration
    await saveConfig(config);
    
    return repository;
  }
  
  /**
   * Gets a repository by ID
   */
  async getRepository(id: string): Promise<Repository> {
    const config = await loadConfig();
    const repository = config.repositories[id];
    
    if (!repository) {
      throw new RepositoryNotFoundError(id);
    }
    
    return repository;
  }
  
  /**
   * Updates a repository
   */
  async updateRepository(id: string, updates: Partial<Omit<Repository, 'id'>>): Promise<Repository> {
    const config = await loadConfig();
    const repository = config.repositories[id];
    
    if (!repository) {
      throw new RepositoryNotFoundError(id);
    }
    
    // Update repository properties
    if (updates.name !== undefined) {
      repository.name = updates.name;
    }
    
    if (updates.active !== undefined) {
      repository.active = updates.active;
    }
    
    if (updates.path !== undefined) {
      const newPath = path.resolve(updates.path);
      
      // Verify it's a valid git repository
      const isGitRepo = await isGitRepository(newPath);
      if (!isGitRepo) {
        throw new InvalidRepositoryError(newPath);
      }
      
      repository.path = newPath;
    }
    
    // Save configuration
    await saveConfig(config);
    
    return repository;
  }
  
  /**
   * Removes a repository
   */
  async removeRepository(id: string): Promise<void> {
    const config = await loadConfig();
    
    if (!config.repositories[id]) {
      throw new RepositoryNotFoundError(id);
    }
    
    // Remove repository from all standups
    Object.values(config.standups).forEach(standup => {
      const index = standup.repositories.indexOf(id);
      if (index !== -1) {
        standup.repositories.splice(index, 1);
        standup.updatedAt = new Date().toISOString();
      }
    });
    
    // Delete repository
    delete config.repositories[id];
    
    // Save configuration
    await saveConfig(config);
  }
  
  /**
   * Lists all repositories, optionally filtered by standup
   */
  async listRepositories(standupId?: string): Promise<Repository[]> {
    const config = await loadConfig();
    
    if (standupId) {
      const standup = config.standups[standupId];
      if (!standup) {
        throw new StandupNotFoundError(standupId);
      }
      
      return standup.repositories
        .map(id => config.repositories[id])
        .filter(Boolean);
    }
    
    return Object.values(config.repositories);
  }
} 