import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';
import { Item } from 'src/items/entities/item.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Column()
  @Field(() => String)
  @IsString()
  fullname: string;

  @Column({ unique: true })
  @Field(() => String)
  @IsString()
  email: string;

  @Column()
  // @Field(() => String) We never want to show password
  @IsString()
  password: string;

  @Column({
    type: 'text',
    array: true,
    default: ['user'],
  })
  @Field(() => [String])
  roles: string[];

  @Column({ type: 'boolean', default: true })
  @Field(() => Boolean)
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.lastUpdateBy, {
    nullable: true,
    lazy: true,
  })
  @JoinColumn({ name: 'lastUpdateBy' })
  @Field(() => User, { nullable: true })
  lastUpdateBy?: User;

  @OneToMany(() => Item, (item) => item.user, { nullable: true })
  @Field(() => [Item], { nullable: true })
  items: Item[];
}
