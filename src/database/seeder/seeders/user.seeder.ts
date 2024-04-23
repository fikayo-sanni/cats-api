import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../http/api/v1/users/entities/users.entity';
import { UserRole } from 'src/common/types/user.types';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async seed(): Promise<void> {
    const count = await this.userRepository.count()

    if (count === 0) {
      const usersData = [
        { username: 'admin', first_name: 'Admin', last_name: 'User', email: 'default@admin.com', password: '5f4dcc3b5aa765d61d8327deb882cf99', roles: [UserRole.USER, UserRole.ADMIN] },
      ];

      const user = this.userRepository.create(usersData);
      await this.userRepository.save(user);
    }
  }
}
