
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import * as dotenv from 'dotenv';
import { QueryLoggerSubscriber } from 'src/common/logger/query';

dotenv.config({path: '.env.local'})
dotenv.config(); 
console.log(`process.env.DB_USERNAME `, process.env.DB_USERNAME, process.env.DB_PASSWORD, process.env.DB_DATABASE , process.env.PORT_DB )
export const dataSourceConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || process.env.PORT_DB) || 3336,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'mysecretpassword',
  database: process.env.DB_DATABASE || 'fullstack',
  entities: [__dirname + "/../**/*.entity.{ts,js}"],
  // synchronize: true,
  migrationsTableName: 'migrations',
  //tránh chết app khi deploy

  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false,
  } : false,
  // ✅ Fix: Thêm connection pool config để tránh connection leak
  extra: {
    max: 10,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 50000,
  },
  // ✅ Fix: Chỉ load files trực tiếp trong migrations folder, không recursive
  migrations: [__dirname + '/../migrations/*.ts'],
  // ✅ Fix: Giảm logging (chỉ log error khi migration để tránh treo)
  logging: ['error'],
  // maxQueryExecutionTime: -1,
  // logger: new SingleLogQueryLogger(),
  subscribers: [QueryLoggerSubscriber],

}

const AppDataSource = new DataSource(dataSourceConfig)

export {AppDataSource}
export default dataSourceConfig
