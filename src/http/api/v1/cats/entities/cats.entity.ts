import { AppEntity } from 'src/app.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class Cat extends AppEntity {
  
  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  breed: string;
  
}