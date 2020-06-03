import { Component, OnInit, NgZone, ViewChild, Input, OnDestroy } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { UserComment } from 'src/app/shared/models/comment';
import { AuthService, FireBaseUser } from 'src/app/shared/services/auth/auth.service';
import { Subscription, Observable } from 'rxjs';
import { CommentService } from 'src/app/shared/services/comment/comment.service';
import { NotificationsService } from 'src/app/shared/services/notifications/notifications.service';
import { Router } from '@angular/router';

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

  constructor(
    private ngZone: NgZone,
    private auth: AuthService,
    private commentService: CommentService,
    private notifications: NotificationsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.authSubscription = this.auth.createSubscription()
      .subscribe((user: FireBaseUser) => user ? this.userId = user.uid : null);
    this.comments$ = this.commentService.createSubscription();
    this.subcribeOnCommentLengthChange();
    this.commentService.loadComments(this.entryId);
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
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
    if (!this.userId) {
      this.router.navigate(['/login'], { queryParams: { action: 'sign-in' } });
      return;
    }
    const { comment } = form.value;
    this._postComment(comment);
  }

  private _postComment(comment: string) {
    const date = new Date().toString();
    const userId = this.userId;
    const postData: UserComment = {comment, date, userId };
    this.commentService.postComment(postData, this.entryId)
      .subscribe((result: string) => {
        if (result) {
          this.form.resetForm();
          this.notifications.createNotification('Comment has been posted');
        }
    });
  }

  public onClick() {
    this.showVal += 10;
    this.isBtnShown = this.showVal < this.coursesTotal;
  }
}
