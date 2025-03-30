import dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

import { sites } from '../src/data/sites.js';
import Store from '../src/models/Store.js';
import connectToDatabase from '../src/lib/db.js';

async function migrateData() {
  try {
    console.log('Connecting to MongoDB...');
    await connectToDatabase();
    console.log('Connected to MongoDB');

    console.log('Starting migration of', sites.length, 'sites to MongoDB');
    
    // Prepare the data for bulk operations
    const storeData = sites.map(site => ({
      domain: site.slug + '.example.com', // Create a domain based on slug as it's required
      title: site.title,
      slug: site.slug,
      description: site.description,
      imageUrl: site.imageUrl || '',
      category: site.category,
      // Other fields will use defaults from the schema
    }));

    // For each store, update if exists (by slug) or insert if not
    for (const data of storeData) {
      await Store.findOneAndUpdate(
        { slug: data.slug },
        data,
        { upsert: true, new: true }
      );
      console.log(`Migrated: ${data.title}`);
    }

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateData(); 