import { v4 as uuidv4 } from 'uuid';
import { Standup, StandupOptions } from '../types';
import { 
  loadConfig, 
  saveConfig,
  StandupExistsError,
  StandupNotFoundError,
  RepositoryNotFoundError,
  getDefaultStandupId
} from '../utils';

/**
 * Service for managing standups
 */
export class StandupService {
  /**
   * Creates a new standup
   */
  async createStandup(options: StandupOptions): Promise<Standup> {
    const config = await loadConfig();
    
    // Check if standup with this name already exists
    const existingStandup = Object.values(config.standups).find(
      (standup) => standup.name.toLowerCase() === options.name.toLowerCase()
    );
    
    if (existingStandup) {
      throw new StandupExistsError(options.name);
    }
    
    // Create new standup
    const now = new Date().toISOString();
    const standup: Standup = {
      id: uuidv4(),
      name: options.name,
      description: options.description,
      repositories: [],
      createdAt: now,
      updatedAt: now
    };
    
    // Add to config
    config.standups[standup.id] = standup;
    
    // If this is the first standup, set it as default
    if (Object.keys(config.standups).length === 1) {
      config.defaultStandupId = standup.id;
    }
    
    // Save configuration
    await saveConfig(config);
    
    return standup;
  }
  
  /**
   * Gets a standup by ID
   */
  async getStandup(id: string): Promise<Standup> {
    const config = await loadConfig();
    
    // If no ID provided, try to get default standup
    if (!id) {
      const defaultId = getDefaultStandupId(config);
      if (!defaultId) {
        throw new StandupNotFoundError('default');
      }
      id = defaultId;
    }
    
    const standup = config.standups[id];
    if (!standup) {
      throw new StandupNotFoundError(id);
    }
    
    return standup;
  }
  
  /**
   * Updates a standup
   */
  async updateStandup(id: string, updates: Partial<Omit<Standup, 'id' | 'createdAt'>>): Promise<Standup> {
    const config = await loadConfig();
    const standup = config.standups[id];
    
    if (!standup) {
      throw new StandupNotFoundError(id);
    }
    
    // Update standup properties
    if (updates.name !== undefined) {
      // Check for name uniqueness
      const existingStandup = Object.values(config.standups).find(
        (s) => s.id !== id && s.name.toLowerCase() === updates.name?.toLowerCase()
      );
      
      if (existingStandup) {
        throw new StandupExistsError(updates.name);
      }
      
      standup.name = updates.name;
    }
    
    if (updates.description !== undefined) {
      standup.description = updates.description;
    }
    
    // Update timestamp
    standup.updatedAt = new Date().toISOString();
    
    // Save configuration
    await saveConfig(config);
    
    return standup;
  }
  
  /**
   * Removes a standup
   */
  async removeStandup(id: string): Promise<void> {
    const config = await loadConfig();
    
    if (!config.standups[id]) {
      throw new StandupNotFoundError(id);
    }
    
    // Remove standup
    delete config.standups[id];
    
    // If this was the default standup, set a new default if available
    if (config.defaultStandupId === id) {
      config.defaultStandupId = getDefaultStandupId(config);
    }
    
    // Save configuration
    await saveConfig(config);
  }
  
  /**
   * Lists all standups
   */
  async listStandups(): Promise<Standup[]> {
    const config = await loadConfig();
    return Object.values(config.standups);
  }
  
  /**
   * Sets the default standup
   */
  async setDefaultStandup(id: string): Promise<Standup> {
    const config = await loadConfig();
    const standup = config.standups[id];
    
    if (!standup) {
      throw new StandupNotFoundError(id);
    }
    
    config.defaultStandupId = id;
    
    // Save configuration
    await saveConfig(config);
    
    return standup;
  }
  
  /**
   * Gets the default standup
   */
  async getDefaultStandup(): Promise<Standup> {
    const config = await loadConfig();
    const defaultId = getDefaultStandupId(config);
    
    if (!defaultId) {
      throw new StandupNotFoundError('default');
    }
    
    return this.getStandup(defaultId);
  }
  
  /**
   * Adds a repository to a standup
   */
  async addRepositoryToStandup(standupId: string, repositoryId: string): Promise<Standup> {
    const config = await loadConfig();
    
    // Check if standup exists
    const standup = config.standups[standupId];
    if (!standup) {
      throw new StandupNotFoundError(standupId);
    }
    
    // Check if repository exists
    if (!config.repositories[repositoryId]) {
      throw new RepositoryNotFoundError(repositoryId);
    }
    
    // Add repository to standup if not already added
    if (!standup.repositories.includes(repositoryId)) {
      standup.repositories.push(repositoryId);
      standup.updatedAt = new Date().toISOString();
      
      // Save configuration
      await saveConfig(config);
    }
    
    return standup;
  }
  
  /**
   * Removes a repository from a standup
   */
  async removeRepositoryFromStandup(standupId: string, repositoryId: string): Promise<Standup> {
    const config = await loadConfig();
    
    // Check if standup exists
    const standup = config.standups[standupId];
    if (!standup) {
      throw new StandupNotFoundError(standupId);
    }
    
    // Check if repository exists
    if (!config.repositories[repositoryId]) {
      throw new RepositoryNotFoundError(repositoryId);
    }
    
    // Remove repository from standup
    const index = standup.repositories.indexOf(repositoryId);
    if (index !== -1) {
      standup.repositories.splice(index, 1);
      standup.updatedAt = new Date().toISOString();
      
      // Save configuration
      await saveConfig(config);
    }
    
    return standup;
  }
} 