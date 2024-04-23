import { Injectable } from '@nestjs/common';
import { UserSeeder } from './seeders/user.seeder';

@Injectable()
export class SeederService {
  constructor(
    private readonly userSeeder: UserSeeder,
    // Add more seeder classes as needed
  ) {}

  async seedAll(): Promise<void> {
    await this.userSeeder.seed();
  }
}
