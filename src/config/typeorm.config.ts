import { DataSource } from 'typeorm';
import * as entities from '../entities/index.js';



export default new DataSource({
    type: (process.env.DB_SOURCE as any) || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'res_db',
    entities: entities.ENTITIES,
    migrations: ['dist/database/migrations/*.js'], // Use dist path for compiled migrations
    synchronize: false, // Migrations enabled, sync disabled
});
