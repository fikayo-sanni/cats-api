import { AppEntity } from 'src/app.entity';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Favorite } from '../../favorites/entities/favorites.entity';

@Entity()
export class Cat extends AppEntity {
  
  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  breed: string;

  @Column()
  user_id: number;

  @ManyToOne(() => User )
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Favorite, favorite => favorite.cat)
  favorite: Favorite[];
  
}