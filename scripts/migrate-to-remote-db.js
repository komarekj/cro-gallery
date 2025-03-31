import dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

// Setup dotenv
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

// Get environment variables
const LOCAL_MONGODB_URI = process.env.MONGODB_URI;
const REMOTE_MONGODB_URI = process.env.REMOTE_MONGODB_URI;

if (!LOCAL_MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable for the local database');
}

if (!REMOTE_MONGODB_URI) {
  throw new Error('Please define the REMOTE_MONGODB_URI environment variable for the remote database');
}

// Import the Store schema without connecting to the database yet
import { Schema } from 'mongoose';

// Define the Store schema to be used for both connections
const storeSchema = new Schema({
  domain: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    // required: true,
  },
  slug: {
    type: String,
    required: true,
    // unique: true,
  },
  description: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  rank: {
    type: Number,
    default: null,
  },
  isShopify: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    default: null,
  },
  productLinks: [{
    type: String,
  }],
  lastScanned: {
    type: Date,
    default: null,
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
  analysis: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

async function migrateData() {
  try {
    // Create separate connections for local and remote databases
    const localConnection = await mongoose.createConnection(LOCAL_MONGODB_URI);
    console.log('Connected to local MongoDB database');
    
    const remoteConnection = await mongoose.createConnection(REMOTE_MONGODB_URI);
    console.log('Connected to remote MongoDB database');
    
    // Create models for both connections using the same schema
    const LocalStore = localConnection.model('Store', storeSchema);
    const RemoteStore = remoteConnection.model('Store', storeSchema);
    
    // Define the query that matches the criteria from the API route
    const query = {
      isShopify: true,
      'metadata.analysis': { $exists: true }
    };
    
    // Count the stores that match our criteria
    const storeCount = await LocalStore.countDocuments(query);
    console.log(`Found ${storeCount} stores matching the criteria for migration`);
    
    // Fetch stores from local database that match the filter criteria
    const stores = await LocalStore.find(query).lean();
    
    console.log(`Starting migration of ${stores.length} stores to remote database`);
    
    let migratedCount = 0;
    let errorCount = 0;
    
    // For each store, update if exists (by slug) or insert if not
    for (const store of stores) {
      try {
        // Keep the original _id instead of removing it
        
        await RemoteStore.findOneAndUpdate(
          { domain: store.domain },
          store,
          { upsert: true, new: true }
        );
        
        migratedCount++;
        console.log(`Migrated (${migratedCount}/${stores.length}): ${store.domain}`);
      } catch (err) {
        errorCount++;
        console.error(`Error migrating store ${store.title}:`, err.message);
      }
    }
    
    console.log(`Migration completed: ${migratedCount} stores migrated successfully, ${errorCount} errors`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close both connections
    await localConnection.close();
    await remoteConnection.close();
    console.log('Database connections closed');
    process.exit(0);
  }
}

migrateData(); 