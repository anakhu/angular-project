import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from 'src/app/shared/models/user/user';
import { UsersService } from '../users/users.service';
import { Subscription } from 'rxjs';
import { routes } from 'src/environments/environment';
import { AppService } from '../app/app.service';
import { API_ERRORS } from '../api/api-errors';
import { CustomError } from '../../models/api/custom-error';
import { LoggedInUser } from '../../models/user/loggedInUser';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { selectAuthUserUid } from 'src/app/store/auth/auth.selectors';

@Injectable({
  providedIn: 'root'
})

export class LikesService {
  private authUser: User;
  private authUserId: string;
  private userSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private app: AppService,
    private store: Store<AppState>,
  ) {
    this.authSubscribe();
  }

  public getUserStatus(courseId: string, key: string): boolean {
    if (this.authUser?.[key]) {
      const courseIndex = this.authUser[key].indexOf(courseId);
      return courseIndex === -1 ? false : true;
    }
    return false;
  }

  public changeLikeStatus(courseId: string): Promise<any> {
    return this.updateLikes(courseId, this.authUserId);
  }

  public changeEnrollStatus(courseId: string): Promise<any> {
    return this.updateEnrollStatus(courseId, this.authUserId);
  }

  public async updateLikes(courseId: string, userId: string ) {
    let result;
    const firebase = this.app.getFirebaseReference();
    const courseRef = firebase.ref(`${routes.users}/${userId}/likedCourses`);
    try {
      await courseRef.transaction((likedCourses: string[]) => {
        const { coursesIds, coursesCount } = this._processUserStatus(likedCourses, courseId);
        result = coursesCount;
        return coursesIds;
      }, (error, committed, snapshot) => {

        if (!committed) {
          const err: CustomError = { ...API_ERRORS.update };
          throw err;
        }

        if (committed) {
          const ref = firebase.ref(`${routes.courses}/${courseId}/likes/`);
          return ref.transaction((likes: number) => {
            const likesNumber = this._processCourseLikes(likes, result);
            return likesNumber;
            });
          }
      });
    } catch (error) {
      console.log(error);
    }
  }

  public async updateEnrollStatus(courseId: string, userId: string ) {
    let result;
    const firebase = this.app.getFirebaseReference();
    const courseRef = firebase.ref(`${routes.users}/${userId}/enrolledCourses`);
    try {
      await courseRef.transaction((enrolledCourses: string[]) => {
        const { coursesIds, coursesCount } = this._processUserStatus(enrolledCourses, courseId);
        result = coursesCount;
        return coursesIds;
      }, (error, committed, snapshot) => {

        if (!committed) {
          const err: CustomError = { ...API_ERRORS.update };
          throw err;
        }

        if (committed) {
          const ref = firebase.ref(`${routes.courses}/${courseId}/students/`);
          return ref.transaction((students: string[]) => {
            const updatedStuddents = this._updateCoursesOnEnroll(students, this.authUserId, result);
            return updatedStuddents;
            });
          }
      });
    } catch (error) {
      console.log(error);
    }
  }

  private authSubscribe(): void {
    this.store.select(selectAuthUserUid)
    .subscribe((userId: string) => {
      if (userId) {
        this.authUserId = userId;
        this.usersService.getUser(userId)
          .subscribe((user: User) => this.authUser = user);
        this._userSubscribe();
      } else {
        this.authUserId = null;
        this.authUser = null;
        if (this.userSubscription) {
          this.userSubscription.unsubscribe();
        }
      }
    });
  }

  private _userSubscribe(): void {
    this.userSubscription = this.usersService.createSubscription()
      .subscribe((users: User[]) => {
        const user = users
          .find((currentUser: User) => currentUser.id === this.authUserId);
        if (this.authUser !== user) {
          this.authUser = user;
        }
      });
  }

  private _processUserStatus(coursesIds: string[], courseId): {coursesIds: string[], coursesCount: number} {
    if (coursesIds?.length && coursesIds.includes(courseId)) {
      const index = coursesIds.indexOf(courseId);
      coursesIds.splice(index, 1);
      return { coursesIds, coursesCount: -1 };
    }

    if (coursesIds?.length && !(coursesIds.includes(courseId))){
      coursesIds.push(courseId);
      return { coursesIds, coursesCount: 1};
    }

    if (!coursesIds) {
      coursesIds = [];
      coursesIds.push(courseId);
      return { coursesIds, coursesCount: 1};
    }
  }

  private _processCourseLikes(likesNumber: number, point: number): number {
    if (likesNumber < 1) {
      likesNumber = 1;
      return likesNumber;
    }

    if (likesNumber && (typeof likesNumber === 'number')) {
      likesNumber += point;
      return likesNumber;
    }
  }

  private _updateCoursesOnEnroll(students: string[], userId: string,  point: number): string[] {
    if (!(students?.length)) {
      students = [];
      students.push(userId);
      return students;
    }

    if (students && point === 1) {
      students.push(userId);
      return students;
    }

    if (students && point === -1) {
      const index = students.indexOf(userId);
      students.splice(index, 1);
      return students;
    }
  }
}
