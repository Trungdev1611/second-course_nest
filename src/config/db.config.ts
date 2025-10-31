
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import * as dotenv from 'dotenv';
dotenv.config(); 
export const dataSourceConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: Number(process.env.PORT_DB)  || 3336,
  username: 'postgres',
  password: 'mysecretpassword',
  database: 'fullstack',
  entities: [__dirname + "/../**/*.entity.{ts,js}"],
  // synchronize: true,
  migrationsTableName: 'migrations',
  migrations: [__dirname + '/../migrations/**/*.ts'], //and config trong package.json,
  logging: ['query', 'error', 'warn']

}

const AppDataSource = new DataSource(dataSourceConfig)

export {AppDataSource}
export default dataSourceConfig
