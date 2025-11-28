import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from './notification.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepo: Repository<NotificationEntity>,
  ) {}

  async createNotification(data: {
    userId: number;
    content: string;
    type: 'normal' | 'request_friend' | 'accept_friend';
    requesterId?: number;
    status?: 'pending' | 'accepted' | 'rejected';
  }) {
    const notification = this.notificationRepo.create({
      userId: data.userId,
      content: data.content,
      type: data.type,
      requesterId: data.requesterId,
      isRead: false,
      status: data.status ?? 'pending',
    });

    return await this.notificationRepo.save(notification);
  }

  async getNotificationsByUserId(userId: number) {
    return await this.notificationRepo.find({
      where: { userId },
      order: { created_at: 'DESC' },
      relations: ['user'],
    });
  }

  async markAsRead(notificationId: number, userId: number) {
    await this.notificationRepo.update(
      { id: notificationId, userId },
      { isRead: true },
    );
  }

  async markAllAsRead(userId: number) {
    await this.notificationRepo.update(
      { userId, isRead: false },
      { isRead: true },
    );
  }

  async getUnreadCount(userId: number) {
    return await this.notificationRepo.count({
      where: { userId, isRead: false },
    });
  }

  async respondToFriendRequest(
    notificationId: number,
    currentUser: { id: number; name?: string },
    action: 'accept' | 'reject',
  ) {
    const notification = await this.notificationRepo.findOne({
      where: { id: notificationId, userId: currentUser.id },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.type !== 'request_friend') {
      throw new BadRequestException('Notification is not a friend request');
    }

    if (notification.status !== 'pending') {
      throw new BadRequestException('Friend request has already been processed');
    }

    if (!notification.requesterId) {
      throw new BadRequestException('Friend request data is invalid');
    }

    const manager = this.notificationRepo.manager;
    const requesterRepo = manager.getRepository(User);
    const requester = await requesterRepo.findOne({
      where: { id: notification.requesterId },
    });
    const requesterName = requester?.name || 'Người dùng';
    const currentUserName = currentUser.name || 'Bạn';

    if (action === 'accept') {
      await manager.transaction(async (transactionManager) => {
        await transactionManager.query(
          `INSERT INTO friendship ("user_target_id", "friend_id") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [currentUser.id, notification.requesterId],
        );

        await transactionManager.query(
          `INSERT INTO friendship ("user_target_id", "friend_id") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [notification.requesterId, currentUser.id],
        );

        await transactionManager
          .getRepository(NotificationEntity)
          .update(notification.id, {
            status: 'accepted',
            type: 'accept_friend',
            content: `${currentUserName} đã chấp nhận lời mời kết bạn`,
            isRead: true,
          });

        await transactionManager.getRepository(NotificationEntity).save({
          userId: notification.requesterId,
          requesterId: currentUser.id,
          content: `${currentUserName} đã chấp nhận lời mời kết bạn`,
          type: 'accept_friend',
          status: 'accepted',
        });
      });

      return { status: 'accepted' };
    }

    await manager.transaction(async (transactionManager) => {
      await transactionManager.getRepository(NotificationEntity).update(notification.id, {
        status: 'rejected',
        isRead: true,
        content: `${currentUserName} đã từ chối lời mời kết bạn`,
      });

      await transactionManager.getRepository(NotificationEntity).save({
        userId: notification.requesterId,
        requesterId: currentUser.id,
        content: `${currentUserName} đã từ chối lời mời kết bạn`,
        type: 'normal',
        status: 'rejected',
      });
    });

    return { status: 'rejected' };
  }
}
