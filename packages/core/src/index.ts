export function greet(name: string): string {
  return `Hello, ${name}!`;
}

export function formatName(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export * from './services/standup-service';
export * from './services/repository-service';
export * from './types';
export * from './utils';
