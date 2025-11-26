import { Injectable } from '@nestjs/common';
import { FriendShipRepository } from './friendship.repository';


@Injectable()
export class FriendShipService {
    constructor( private readonly friendShipRepo: FriendShipRepository) {

      }

     async getFriendShipbyUserId(idUser: number) {
        return await this.friendShipRepo.getFriendShipbyUserId(idUser)
     }
}
