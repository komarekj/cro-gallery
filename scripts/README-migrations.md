# Database Migration Scripts

This directory contains scripts for migrating data between MongoDB databases.

## Available Scripts

### `migrate-to-mongodb.js`

Migrates data from the static JSON file (`src/data/sites.js`) to the local MongoDB database.

Usage:
```bash
node scripts/migrate-to-mongodb.js
```

### `migrate-to-remote-db.js`

Migrates data from the local MongoDB database to a remote MongoDB database. 
This script only migrates stores that would appear in the store list based on the API filter criteria:
- `isShopify: true`
- `metadata.analysis` exists

Setup:
1. Add your REMOTE_MONGODB_URI to your `.env` file:
   ```
   REMOTE_MONGODB_URI=mongodb+srv://username:password@cluster0.example.mongodb.net/remote-database?retryWrites=true&w=majority
   ```

2. Run the migration script:
   ```bash
   node scripts/migrate-to-remote-db.js
   ```

The script will:
1. Connect to both local and remote MongoDB databases
2. Fetch stores from the local database that match the filter criteria
3. Migrate each store to the remote database (update if exists by slug, or insert if not)
4. Log the migration progress and results
5. Close the database connections after completion

## Troubleshooting

If you encounter any issues:

1. Ensure both `MONGODB_URI` and `REMOTE_MONGODB_URI` are correctly set in your `.env` file
2. Check that you have network access to both MongoDB instances
3. Verify you have the proper access permissions for both databases 