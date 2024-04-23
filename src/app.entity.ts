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
    created_at: Date;
  
    @UpdateDateColumn()
    update_at: Date;
  }
  