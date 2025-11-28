import {
  Controller,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from 'src/guard/jwtAuthGuard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách thông báo của user' })
  @ApiResponse({ status: 200, description: 'Danh sách thông báo' })
  async getNotifications(@Request() req) {
    const notifications = await this.notificationService.getNotificationsByUserId(
      req.user.id,
    );
    return { data: notifications };
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Đánh dấu thông báo đã đọc' })
  @ApiResponse({ status: 200, description: 'Đánh dấu thành công' })
  async markAsRead(@Param('id') id: string, @Request() req) {
    await this.notificationService.markAsRead(Number(id), req.user.id);
    return { message: 'Marked as read' };
  }

  @Put('read-all')
  @ApiOperation({ summary: 'Đánh dấu tất cả thông báo đã đọc' })
  @ApiResponse({ status: 200, description: 'Đánh dấu thành công' })
  async markAllAsRead(@Request() req) {
    await this.notificationService.markAllAsRead(req.user.id);
    return { message: 'All marked as read' };
  }

  @Put(':id/accept')
  @ApiOperation({ summary: 'Chấp nhận lời mời kết bạn' })
  async acceptFriendRequest(@Param('id') id: string, @Request() req) {
    const result = await this.notificationService.respondToFriendRequest(
      Number(id),
      req.user,
      'accept',
    );
    return { message: 'Friend request accepted', ...result };
  }

  @Put(':id/reject')
  @ApiOperation({ summary: 'Từ chối lời mời kết bạn' })
  async rejectFriendRequest(@Param('id') id: string, @Request() req) {
    const result = await this.notificationService.respondToFriendRequest(
      Number(id),
      req.user,
      'reject',
    );
    return { message: 'Friend request rejected', ...result };
  }
}
