import { DataSource, DataSourceOptions } from 'typeorm';
import appConfiguration from 'src/common/config/envs/app.config';
import { User } from 'src/http/api/v1/users/entities/users.entity';
import { Cat } from 'src/http/api/v1/cats/entities/cats.entity';
import { Favorite } from 'src/http/api/v1/favorites/entities/favorites.entity';

const appConfig = appConfiguration();

export const dbdatasource: DataSourceOptions = {
  // TypeORM PostgreSQL DB Drivers
  type: 'postgres',
  host: appConfig.DB_HOST,
  port: 5432,
  username: appConfig.DB_USERNAME,
  password: appConfig.DB_PASSWORD,
  database: appConfig.DB_NAME,
  entities: [User, Cat, Favorite],
  synchronize: true,
  migrations: ['datbase/migrations/*.js'],
  migrationsTableName: "tundrax_migrations",
  extra: {
    ssl: {
      rejectUnauthorized: false
    },
  }
};

const dataSource = new DataSource(dbdatasource)
export default dataSource