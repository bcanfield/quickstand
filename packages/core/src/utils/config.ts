import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { ConfigData } from '../types';

// Configuration directory and file paths
const CONFIG_DIR = path.join(os.homedir(), '.quickstand');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// Default empty configuration
const DEFAULT_CONFIG: ConfigData = {
  standups: {},
  repositories: {},
};

/**
 * Ensures the configuration directory exists
 */
export async function ensureConfigDir(): Promise<void> {
  try {
    await fs.mkdir(CONFIG_DIR, { recursive: true });
  } catch (error) {
    throw new Error(`Failed to create config directory: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Loads the configuration from disk
 * Creates default configuration if it doesn't exist
 */
export async function loadConfig(): Promise<ConfigData> {
  try {
    await ensureConfigDir();
    
    try {
      const configData = await fs.readFile(CONFIG_FILE, 'utf-8');
      return JSON.parse(configData) as ConfigData;
    } catch (error) {
      // If file doesn't exist or is invalid, create default config
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        await saveConfig(DEFAULT_CONFIG);
        return DEFAULT_CONFIG;
      }
      
      // For parsing errors, try to recover by creating a new config
      if (error instanceof SyntaxError) {
        console.error('Config file is corrupted, creating a new one');
        await saveConfig(DEFAULT_CONFIG);
        return DEFAULT_CONFIG;
      }
      
      throw error;
    }
  } catch (error) {
    throw new Error(`Failed to load config: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Saves the configuration to disk
 */
export async function saveConfig(config: ConfigData): Promise<void> {
  try {
    await ensureConfigDir();
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (error) {
    throw new Error(`Failed to save config: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Gets the default standup ID from configuration
 * If no default is set but standups exist, returns the first one
 */
export function getDefaultStandupId(config: ConfigData): string | undefined {
  // If there's a default standup ID and it exists in the config, use that
  if (config.defaultStandupId && config.standups[config.defaultStandupId]) {
    return config.defaultStandupId;
  }
  
  // Otherwise, return the first standup if any exist
  const standupIds = Object.keys(config.standups);
  return standupIds.length > 0 ? standupIds[0] : undefined;
} 