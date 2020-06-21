import { Component, OnInit, NgZone, ViewChild, Input, OnDestroy } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take, first, switchMap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { UserComment } from 'src/app/shared/models/comments/comment';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Subscription, Observable, EMPTY } from 'rxjs';
import { CommentService } from 'src/app/shared/services/comment/comment.service';
import { NotificationsService } from 'src/app/shared/services/notifications/notifications.service';
import { Router } from '@angular/router';
import { LoggedInUser } from 'src/app/shared/models/user/loggedInUser';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { selectAuthUserUid } from 'src/app/store/auth/auth.selectors';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit, OnDestroy {
  @ViewChild('textArea') autosize: CdkTextareaAutosize;
  @ViewChild('form') form: NgForm;
  @Input() entryId: string;
  comments$: Observable<any>;
  userId: string;
  authSubscription: Subscription;
  commentLenSubscription: Subscription;
  coursesTotal: number;
  showVal = 5;
  isBtnShown = false;
  authUserId$: Observable<string>;

  constructor(
    private ngZone: NgZone,
    private commentService: CommentService,
    private notifications: NotificationsService,
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.authUserId$ = this.store.select(selectAuthUserUid);
    this.comments$ = this.commentService.createSubscription();
    this.subcribeOnCommentLengthChange();
    this.commentService.loadComments(this.entryId);
  }

  ngOnDestroy(): void {
    this.commentLenSubscription.unsubscribe();
    this.commentService.clearComments();
  }

  public triggerResize(): void {
    this.ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  public subcribeOnCommentLengthChange() {
    this.commentLenSubscription = this.commentService.createCommentsLenSubscription()
      .subscribe((commentsLen: number) => {
        this.coursesTotal = commentsLen;
        this.isBtnShown = this.showVal < this.coursesTotal;
      });
  }

  public onPost(form: NgForm) {
    const { comment } = form.value;
    this._postComment(comment);
  }

  public onClick() {
    this.showVal += 10;
    this.isBtnShown = this.showVal < this.coursesTotal;
  }

  private _postComment(comment: string) {
    const date = new Date().toString();
    this.authUserId$
      .pipe(
        take(1),
        switchMap((userId: string) => {
          if (userId) {
            const postData: UserComment = {comment, date, userId };
            return this.commentService.postComment(postData, this.entryId);
          }
          return EMPTY;
        })
      )
      .subscribe((result: string) => {
        if (result) {
          this.form.resetForm();
          this.notifications.createNotification('Comment has been posted');
        }
      });
  }
}
