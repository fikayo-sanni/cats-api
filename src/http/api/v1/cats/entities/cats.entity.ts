import { AppEntity } from 'src/app.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class Cats extends AppEntity {
  
  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  breed: string;
  
}