const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'pg://postgres:postgres@localhost:5432/brand_db';

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
    'CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
query.on('end', () => { client.end(); });