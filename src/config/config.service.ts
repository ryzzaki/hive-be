import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigKeys } from './configKeys.enum';
import { join } from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor(
    filePath: string = process.env.NODE_ENV === 'production'
      ? '.env'
      : process.env.NODE_ENV === 'test'
      ? '.env.test'
      : '.env.development',
  ) {
    try {
      this.envConfig = dotenv.parse(fs.readFileSync(filePath));
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.envConfig = {};
        return;
      }
      throw error;
    }
  }

  get(key: ConfigKeys, defaultValue?: string): string | undefined {
    return process.env[key] || this.envConfig[key] || defaultValue;
  }

  isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  isTest(): boolean {
    return process.env.NODE_ENV === 'test';
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: this.get(
        ConfigKeys.DATABASE_URL,
        'postgres://vcn@localhost:5432/hive_dev',
      ),
      entities: [join(__dirname, '/../**/*.entity.{js,ts}')],
      migrations: [join(__dirname, '..', '..', 'migrations', '*.{js,ts}')],
      autoLoadEntities: true,
      dropSchema: this.isTest(),
      synchronize: this.isTest(),
      ssl: this.isProduction() && {
        rejectUnauthorized: false,
      },
      migrationsTransactionMode: 'all',
    };
  }
}

const configService = new ConfigService();

export { configService };
