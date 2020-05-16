import { Follower } from '../../models/followers';

export class FireBaseFollower implements Follower {
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
