const { Client } = require('pg');
require('dotenv').config();

console.log('Testing DB Connection...');
console.log('Host:', process.env.POSTGRES_HOST);
console.log('Port:', process.env.POSTGRES_PORT);
console.log('User:', process.env.POSTGRES_USERNAME);
console.log('Database:', process.env.POSTGRES_DATABASE);
console.log('Password length:', process.env.POSTGRES_PASSWORD ? process.env.POSTGRES_PASSWORD.length : 0);

const client = new Client({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  user: process.env.POSTGRES_USERNAME || 'postgres',
  password: process.env.POSTGRES_PASSWORD || '',
  database: 'postgres', // Connect to default DB
});

client.connect()
  .then(async () => {
    console.log('Connected to default postgres database.');
    try {
      await client.query(`CREATE DATABASE "${process.env.POSTGRES_DATABASE || 'res_db'}"`);
      console.log(`Database "${process.env.POSTGRES_DATABASE || 'res_db'}" created successfully.`);
    } catch (err) {
      if (err.code === '42P04') {
        console.log(`Database "${process.env.POSTGRES_DATABASE || 'res_db'}" already exists.`);
      } else {
        console.error('Error creating database:', err.message);
      }
    }
    client.end();
  })
  .catch(err => {
    console.error('Connection failed:', err.message);
    client.end();
  });
