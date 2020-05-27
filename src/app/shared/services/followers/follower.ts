import { Follower } from './follower.interface';

export class NewFollower implements Follower {
  constructor(
    public userId: string,
    public followerId: string,
    public id: string
    ) {
      this.userId = userId;
      this.followerId = followerId;
      this.id = id;
    }
}
