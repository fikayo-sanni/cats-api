import { AppEntity } from 'src/app.entity';
import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Cat } from '../../cats/entities/cats.entity';

@Entity()
@Index(['user_id', 'cat_id'], { unique: true }) // Unique index on user_id and cat_id combination
export class Favorite extends AppEntity {

    @Column()
    cat_id: number;

    @ManyToOne(() => Cat)
    @JoinColumn({ name: 'cat_id' })
    cat: Cat;

    @Column()
    user_id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

}