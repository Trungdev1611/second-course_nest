// import { User } from 'src/users/user.entity';
// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';


// // @Entity('friendships')
// export class Friendship {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   // Người gửi lời mời kết bạn
//   @ManyToOne(() => User, (user) => user.sentFriendRequests, { onDelete: 'CASCADE' })
//   @JoinColumn({ name: 'requesterId' })
//   requester: User;

//   @Column()
//   requesterId: string;

//   // Người nhận lời mời kết bạn
//   @ManyToOne(() => User, (user) => user.receivedFriendRequests, { onDelete: 'CASCADE' })
//   @JoinColumn({ name: 'receiverId' })
//   receiver: User;

//   @Column()
//   receiverId: string;

//   // Trạng thái: pending, accepted, blocked
//   @Column({ type: 'enum', enum: ['pending', 'accepted', 'blocked'], default: 'pending' })
//   status: 'pending' | 'accepted' | 'blocked';

//   @CreateDateColumn()
//   createdAt: Date;
// }
