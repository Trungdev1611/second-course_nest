import { Module } from '@nestjs/common';
import { FriendShipController } from './friend_ship.controller';
import { FriendShipService } from './friendship.service';
import { FriendShipRepository } from './friendship.repository';

@Module({
  imports: [],
  controllers: [FriendShipController],
  providers: [FriendShipService, FriendShipRepository],
  exports: []
})
export class FriendshipModule {}