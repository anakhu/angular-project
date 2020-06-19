import { UserComment } from './comment';

export interface DisplayedComment extends UserComment {
  name: string;
  userPic?: string;
}
