// src/seeds/main-seed.ts
import { DataSource } from 'typeorm';
import { seedRoles } from './role.seed';
import { AppDataSource } from 'src/config/db.config';

const dataSource = AppDataSource

dataSource.initialize()
  .then(async () => {
    console.log('🌱 Starting Seeding...');
    await seedRoles(dataSource);
    console.log('🌱 Seeding Finished.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  });
