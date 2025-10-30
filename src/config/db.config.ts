
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const dataSourceConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 3336,
  username: 'postgres',
  password: 'mysecretpassword',
  database: 'fullstack',
  entities: [__dirname + "/../**/*.entity.{ts,js}"],
  // synchronize: true,
  migrationsTableName: 'migrations',
  migrations: [__dirname + '/../migrations/**/*.ts'] //and config trong package.json
}

const AppDataSource = new DataSource(dataSourceConfig)

export {AppDataSource}
export default dataSourceConfig
