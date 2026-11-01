import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      // useFactory: (config: ConfigService) => ({
      //   dialect: 'mysql',
      //   host: config.get<string>('DB_HOST'),
      //   port: config.get<number>('DB_PORT'),
      //   username: config.get<string>('DB_USERNAME'),
      //   password: config.get<string>('DB_PASSWORD'),
      //   database: config.get<string>('DB_NAME'),
      //   autoLoadModels: true,
      //   synchronize: true, // dev only; use sequelize-cli migrations before production
      //   sync: { alter: true },
      // }),
      useFactory: (config: ConfigService) => {
        const isProd = config.get<string>('NODE_ENV') === 'production';
        return {
          dialect: 'mysql',
          host: config.get<string>('DB_HOST'),
          port: config.get<number>('DB_PORT'),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_NAME'),
          autoLoadModels: true,
          synchronize: config.get<string>('DB_SYNC') === 'true',
          sync: { alter: !isProd }, // never alter existing tables in production
          dialectOptions:
            config.get<string>('DB_SSL') === 'true'
              ? { ssl: { rejectUnauthorized: true } }
              : {},
        };
      },
    }),
    UsersModule,
    AuthModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
