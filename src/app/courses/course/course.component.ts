import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Course } from 'src/shared/models/course';
import { User } from 'src/shared/models/user';
import { UsersService } from 'src/shared/services/users/users.service';
import { tap } from 'rxjs/internal/operators/tap';
import { catchError } from 'rxjs/operators';
import { EMPTY, Subscription } from 'rxjs';
import { CoursesService } from 'src/shared/services/courses/courses.service';
import { LikesService } from 'src/shared/services/likes/likes.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, OnDestroy {

  @Input() course: Course;
  @Input() authUserStatus: boolean;
  author: User;
  subscription: Subscription;
  isLiked = false;

  constructor(
    private usersService: UsersService,
    private coursesService: CoursesService,
    private likesService: LikesService,
  ) { }

  ngOnInit(): void {
    this.getUser(this.course.authorId);
    this.subscribe();
    if (this.authUserStatus) {
      this.getCourseLikeStatus();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private getCourseLikeStatus(): void {
   this.isLiked = this.likesService.getLikeStatus(this.course.id);
  }

  private subscribe(): void {
    this.subscription = this.coursesService.createSubscription()
      .subscribe((courses: Course[]) => {
        const currentCourse = courses
          .find((course: Course) => course.id === this.course.id );

        if (currentCourse) {
          this.course = currentCourse;
        }
      });
  }

  private getUser(id: number): void {
    this.usersService.getUser(this.course.authorId)
      .subscribe((user: User) => this.author = user);
  }

  likeCourse(): void {
    this.likesService.toggleLikeStatus(this.course.id);
    this.getCourseLikeStatus();
  }
}
