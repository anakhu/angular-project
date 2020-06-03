import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { UserComment} from 'src/app/shared/models/comment';
import { routes } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { UsersService } from '../users/users.service';
import { mergeAll, concatMap, map, toArray, tap } from 'rxjs/operators';
import { User } from '../../models/user';
import { AppService } from '../app/app.service';


export interface DisplayedComment extends UserComment {
  name: string;
  userPic?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(
    private api: ApiService,
    private users: UsersService,
    private app: AppService
  ) { }

  private comments: DisplayedComment[] = [];
  private commentSubject = new BehaviorSubject<DisplayedComment[]>(null);
  private commentsLength = new BehaviorSubject<number>(0);

  public createSubscription() {
    return this.commentSubject.asObservable();
  }

  public createCommentsLenSubscription() {
    return this.commentsLength.asObservable();
  }

  public loadComments(entryId: string): void {
    this.api.getCollectionEntries(`${routes.comments}/${entryId}`)
      .pipe(
        mergeAll(),
        concatMap((comment: UserComment) => {
          return this._getCommentAuthorName(comment);
        }),
        toArray(),
      )
      .subscribe((result: DisplayedComment[]) => {
        this.comments = result;
        this.commentsLength.next(this.comments.length);
        this.commentSubject.next(result);
        this._listenToNewCommentEvents(entryId);
      });
  }

  public postComment(comment: UserComment, entryId: string): Observable<string> {
    return this.api.pushEntry(`${routes.comments}/${entryId}/`, comment);
  }

  private _listenToNewCommentEvents(entryId: string): Observable<any> {
    return this.app.getFirebaseReference()
      .ref(`${routes.comments}/${entryId}`)
      .on('child_added', (data: any) => {
        const newComment = {id: data.key, ...data.val()};
        const existingComment = this.comments
          .find((entry: DisplayedComment) => entry.id === newComment.id);
        if (!existingComment) {
          this._getCommentAuthorName(newComment)
            .subscribe((comment: DisplayedComment) => {
              this.comments = [...this.comments, comment];
              this.commentsLength.next(this.comments.length);
              this.commentSubject.next(this.comments);
            });
        }
      });
  }

  private _getCommentAuthorName(comment: UserComment): Observable<DisplayedComment> {
    return this.users.getUser(comment.userId)
      .pipe(
        map((user: User) => {
          if (user) {
            const { name, image } = user;
            return {...comment, name, image } as DisplayedComment;
          }
          return  {...comment, name: null } as DisplayedComment;
        })
      );
  }

  public clearComments() {
    this.commentSubject.next(null);
  }
}
