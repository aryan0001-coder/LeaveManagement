import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  const logger = new Logger('Seed');
  logger.log('Starting database seeding...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);

  try {
    await seedService.seedLeaveTypes();
    logger.log('Database seeding completed successfully');
  } catch (error) {
    logger.error('Database seeding failed', error);
  } finally {
    await app.close();
  }
}

bootstrap();