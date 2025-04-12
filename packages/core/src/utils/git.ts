import { promises as fs } from 'fs';
import path from 'path';
import { promisify } from 'util';
import { exec as execCallback } from 'child_process';

const exec = promisify(execCallback);

/**
 * Verifies if a path is a valid git repository
 */
export async function isGitRepository(repoPath: string): Promise<boolean> {
  try {
    // Check if the path exists
    try {
      const stats = await fs.stat(repoPath);
      if (!stats.isDirectory()) {
        return false;
      }
    } catch {
      return false;
    }
    
    // Check if .git directory exists
    const gitDir = path.join(repoPath, '.git');
    try {
      const gitStats = await fs.stat(gitDir);
      if (!gitStats.isDirectory()) {
        return false;
      }
    } catch {
      // Try running git command as a fallback (for worktrees or submodules)
      try {
        await exec(`git -C "${repoPath}" rev-parse --is-inside-work-tree`);
        return true;
      } catch {
        return false;
      }
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Gets the name of a git repository from its path
 * Returns the name of the directory if we can't determine the git repo name
 */
export async function getRepositoryName(repoPath: string): Promise<string> {
  try {
    // Try to get repository name from git config
    try {
      const { stdout } = await exec(`git -C "${repoPath}" config --get remote.origin.url`);
      const url = stdout.trim();
      if (url) {
        // Extract repo name from URL (works with various git URL formats)
        const match = url.match(/\/([^\/]+?)(\.git)?$/);
        if (match && match[1]) {
          return match[1];
        }
      }
    } catch {
      // Ignore errors, fall back to directory name
    }
    
    // Fall back to directory name
    return path.basename(repoPath);
  } catch (error) {
    // Last resort fallback
    return path.basename(repoPath);
  }
} 