import {
    UpdateDateColumn,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    BaseEntity,
  } from 'typeorm';
  
  export abstract class AppEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updateAt: Date;
  }
  