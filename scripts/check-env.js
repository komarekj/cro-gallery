import dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// Setup dotenv
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

// Get environment variables and log safer versions
const LOCAL_MONGODB_URI = process.env.MONGODB_URI;
const REMOTE_MONGODB_URI = process.env.REMOTE_MONGODB_URI;

function sanitizeUri(uri) {
  if (!uri) return 'undefined';
  
  try {
    const url = new URL(uri);
    // Check if it has a protocol, host, etc.
    return `Format: ${url.protocol ? 'Has protocol' : 'Missing protocol'}, ${url.hostname ? 'Has hostname' : 'Missing hostname'}`;
  } catch (error) {
    return `Invalid URI: ${error.message}`;
  }
}

console.log('Local MongoDB URI status:', sanitizeUri(LOCAL_MONGODB_URI));
console.log('Remote MongoDB URI status:', sanitizeUri(REMOTE_MONGODB_URI)); 