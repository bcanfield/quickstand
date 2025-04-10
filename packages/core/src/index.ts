export function greet(name: string): string {
  return `Hello, ${name}!`;
}

export function formatName(name: string): string {
  return name.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
