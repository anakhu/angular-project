import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Course } from 'src/shared/models/course';
import { User } from 'src/shared/models/user';
import { UsersService } from 'src/shared/services/users/users.service';
import { Subscription } from 'rxjs';
import { CoursesService } from 'src/shared/services/courses/courses.service';
import { LikesService } from 'src/shared/services/likes/likes.service';
import { AuthService } from 'src/shared/services/auth/auth.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, OnDestroy {

  @Input() course: Course;
  @Input() authUserStatus: boolean;
  @Input() isStandAloneComponent: false;

  author: User;

  coursesSubscription: Subscription;
  userSubscription: Subscription;
  authSubscription: Subscription;

  isLiked = false;

  constructor(
    private usersService: UsersService,
    private coursesService: CoursesService,
    private likesService: LikesService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getUser(this.course.authorId);
    this.createAuthSubsciption();
    if (this.isStandAloneComponent) {
      this.createCoursesSubscribtion();
    }
    // this.getCourseLikeStatus();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
    if (this.coursesSubscription) {
      this.coursesSubscription.unsubscribe();
    }
  }

  private getCourseLikeStatus(): void {
    this.isLiked = this.likesService.getLikeStatus(this.course.id);
  }

  private createAuthSubsciption(): void {
    this.authSubscription = this.authService.createSubscription()
      .subscribe((authStatus: boolean) => {
        if (authStatus) {
          this.getCourseLikeStatus();
        }
      });
  }

  private createCoursesSubscribtion(): void {
    this.coursesSubscription = this.coursesService.createSubscription()
      .subscribe((courses: Course[]) => {
        const currentCourse = courses
          .find((course: Course) => course.id === this.course.id );

        if (currentCourse) {
          this.course = currentCourse;
          // console.log('the course is updated');
          // this.getCourseLikeStatus();
          // console.log(`the like status of ${this.course.id} is ${this.isLiked}`)
        }
      });
  }


  private getUser(id: number): void {
    this.usersService.getUser(this.course.authorId)
      .subscribe((user: User) => this.author = user);
  }

  likeCourse(): void {
    // console.log('like status before', this.isLiked);
    this.likesService.toggleLikeStatus(this.course.id);
    this.isLiked = !this.isLiked;
    // console.log('like status after', this.isLiked);
  }
}
