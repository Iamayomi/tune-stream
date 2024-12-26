import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SeedData } from '../../../db/seeds/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly connection: DataSource) {}

  async seeder(): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;
    //   await seedData(manager)
      const seedData = new SeedData(manager);
      seedData.seedArtist;
      seedData.seedUser;
      seedData.seedPlayLists;
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log('Error during database seeding:', err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
