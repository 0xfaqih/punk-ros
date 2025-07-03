import fs from 'fs';
import path from 'path';

export function loadAddresses(): string[] {
  const filePath = path.join(process.cwd(), 'addresses.txt');
  const data = fs.readFileSync(filePath, 'utf-8');
  return data
    .split('\n')
    .map((addr) => addr.trim())
    .filter((addr) => addr.length > 0);
}
