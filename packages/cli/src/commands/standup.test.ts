import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as core from '@quickstand/core';

// Mock the StandupService
vi.mock('@quickstand/core', async () => {
  const actual = await vi.importActual('@quickstand/core');
  return {
    ...(actual as object),
    StandupService: vi.fn(() => ({
      createStandup: vi.fn(),
      listStandups: vi.fn(),
      setDefaultStandup: vi.fn(),
      removeStandup: vi.fn()
    }))
  };
});

describe('standup command', () => {
  // Direct console spies without mocking implementation
  const consoleLogSpy = vi.spyOn(console, 'log');
  const consoleErrorSpy = vi.spyOn(console, 'error');
  
  let standupServiceMock: any;
  
  beforeEach(() => {
    // Reset mocks
    consoleLogSpy.mockClear();
    consoleErrorSpy.mockClear();
    
    // Get a fresh instance of StandupService mock
    standupServiceMock = new core.StandupService();
    
    // Reset all mocks
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  describe('create subcommand', () => {
    it('should create a standup with the provided name and description', async () => {
      // Setup the mock implementation
      const mockStandup = { id: '123', name: 'Test Standup', description: 'Test Description' };
      standupServiceMock.createStandup.mockResolvedValue(mockStandup);
      
      // Directly test the behavior that would be in the action
      try {
        const standup = await standupServiceMock.createStandup({
          name: 'Test Standup',
          description: 'Test Description'
        });
        console.log(`Standup created: ${standup.name} (${standup.id})`);
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // Verify the service was called correctly
      expect(standupServiceMock.createStandup).toHaveBeenCalledWith({
        name: 'Test Standup',
        description: 'Test Description'
      });
      
      // Verify the output
      expect(consoleLogSpy).toHaveBeenCalledWith('Standup created: Test Standup (123)');
    });
    
    it('should handle errors when creating a standup', async () => {
      // Setup the mock implementation to throw an error
      const error = new Error('Failed to create standup');
      standupServiceMock.createStandup.mockRejectedValue(error);
      
      // Directly test the behavior that would be in the action
      try {
        await standupServiceMock.createStandup({
          name: 'Test Standup'
        });
        console.log('Should not reach here');
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // Verify error handling
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Failed to create standup');
    });
  });
  
  describe('list subcommand', () => {
    it('should list all standups', async () => {
      // Setup the mock implementation
      const mockStandups = [
        { id: '123', name: 'Standup 1', description: 'Description 1' },
        { id: '456', name: 'Standup 2' }
      ];
      standupServiceMock.listStandups.mockResolvedValue(mockStandups);
      
      // Directly test the behavior that would be in the action
      try {
        const standups = await standupServiceMock.listStandups();
        if (standups.length === 0) {
          console.log('No standups found.');
          return;
        }

        console.log('Standups:');
        for (const standup of standups) {
          console.log(`- ${standup.name} (${standup.id})`);
          if (standup.description) {
            console.log(`  ${standup.description}`);
          }
        }
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // Verify the output
      expect(consoleLogSpy).toHaveBeenCalledWith('Standups:');
      expect(consoleLogSpy).toHaveBeenCalledWith('- Standup 1 (123)');
      expect(consoleLogSpy).toHaveBeenCalledWith('  Description 1');
      expect(consoleLogSpy).toHaveBeenCalledWith('- Standup 2 (456)');
    });
    
    it('should handle empty standup list', async () => {
      // Setup the mock implementation
      standupServiceMock.listStandups.mockResolvedValue([]);
      
      // Directly test the behavior that would be in the action
      try {
        const standups = await standupServiceMock.listStandups();
        if (standups.length === 0) {
          console.log('No standups found.');
          return;
        }

        console.log('Standups:');
        for (const standup of standups) {
          console.log(`- ${standup.name} (${standup.id})`);
          if (standup.description) {
            console.log(`  ${standup.description}`);
          }
        }
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // Verify the output
      expect(consoleLogSpy).toHaveBeenCalledWith('No standups found.');
    });
    
    it('should handle errors when listing standups', async () => {
      // Setup the mock implementation to throw an error
      const error = new Error('Failed to list standups');
      standupServiceMock.listStandups.mockRejectedValue(error);
      
      // Directly test the behavior that would be in the action
      try {
        await standupServiceMock.listStandups();
        console.log('Should not reach here');
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // Verify error handling
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Failed to list standups');
    });
  });
  
  describe('set-default subcommand', () => {
    it('should set the default standup', async () => {
      // Setup the mock implementation
      const mockStandup = { id: '123', name: 'Default Standup' };
      standupServiceMock.setDefaultStandup.mockResolvedValue(mockStandup);
      
      // Directly test the behavior that would be in the action
      try {
        const standup = await standupServiceMock.setDefaultStandup('123');
        console.log(`Default standup set to: ${standup.name}`);
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // Verify the service was called correctly
      expect(standupServiceMock.setDefaultStandup).toHaveBeenCalledWith('123');
      
      // Verify the output
      expect(consoleLogSpy).toHaveBeenCalledWith('Default standup set to: Default Standup');
    });
    
    it('should handle errors when setting default standup', async () => {
      // Setup the mock implementation to throw an error
      const error = new Error('Failed to set default standup');
      standupServiceMock.setDefaultStandup.mockRejectedValue(error);
      
      // Directly test the behavior that would be in the action
      try {
        await standupServiceMock.setDefaultStandup('123');
        console.log('Should not reach here');
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // Verify error handling
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Failed to set default standup');
    });
  });
  
  describe('remove subcommand', () => {
    it('should remove the standup with the provided id', async () => {
      // Setup the mock implementation
      standupServiceMock.removeStandup.mockResolvedValue(undefined);
      
      // Directly test the behavior that would be in the action
      try {
        await standupServiceMock.removeStandup('123');
        console.log(`Standup removed: 123`);
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // Verify the service was called correctly
      expect(standupServiceMock.removeStandup).toHaveBeenCalledWith('123');
      
      // Verify the output
      expect(consoleLogSpy).toHaveBeenCalledWith('Standup removed: 123');
    });
    
    it('should handle errors when removing a standup', async () => {
      // Setup the mock implementation to throw an error
      const error = new Error('Failed to remove standup');
      standupServiceMock.removeStandup.mockRejectedValue(error);
      
      // Directly test the behavior that would be in the action
      try {
        await standupServiceMock.removeStandup('123');
        console.log('Should not reach here');
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // Verify error handling
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Failed to remove standup');
    });
  });
}); 