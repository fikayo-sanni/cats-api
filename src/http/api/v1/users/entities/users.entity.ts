import { AppEntity } from 'src/app.entity';
import { Entity, Column, Unique } from 'typeorm';

@Entity()
@Unique(['email', 'username'])
export class User extends AppEntity {
  
  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  refresh_token: string;
  
}