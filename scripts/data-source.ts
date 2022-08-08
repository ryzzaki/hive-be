import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '../src/config/config.service';

const configService = new ConfigService();

export const AppDataSource = new DataSource(
  configService.createTypeOrmOptions() as DataSourceOptions,
);
