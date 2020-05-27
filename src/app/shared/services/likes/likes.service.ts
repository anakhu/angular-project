import { Injectable } from '@angular/core';
import { AuthService, FireBaseUser } from '../auth/auth.service';
import { User } from 'src/app/shared/models/user';
import { UsersService } from '../users/users.service';
import { Subscription, Observable, from } from 'rxjs';
import { LoginUser } from '../auth/login.user';
import { ApiService } from '../api/api.service';
import { routes } from 'src/environments/environment';
import { AppService } from '../app/app.service';

@Injectable({
  providedIn: 'root'
})

export class LikesService {
  private authUser: User;
  private authUserId: string;
  private userSubscription: Subscription;
  private authSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private api: ApiService,
    private app: AppService
  ) {
    this.authSubscribe();
  }

  private authSubscribe(): void {
    this.authSubscription = this.authService.createSubscription()
      .subscribe((loginUser: FireBaseUser) => {
        if (loginUser) {
          this.authUserId = loginUser.uid;
          this.usersService.getUser(this.authUserId)
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

  public getLikeStatus(courseId: string): boolean {
    if (this.authUser?.likedCourses) {
      const courseIndex = this.authUser.likedCourses.indexOf(courseId);
      return courseIndex === -1 ? false : true;
    }
    return false;
  }

  public changeLikeStatus(courseId: string): Promise<any> {
    return this.updateLikes(courseId, this.authUserId);
  }

  public async updateLikes(courseId: string, userId: string ) {
    let result;
    const firebase = this.app.getFirebaseReference();
    const courseRef = firebase.ref(`${routes.users}/${userId}/likedCourses`);
    try {
      await courseRef.transaction((likedCourses: string[]) => {
        const { coursesIds, likesCount } = this.processUserLikes(likedCourses, courseId);
        result = likesCount;
        return coursesIds;
      }, (error, committed, snapshot) => {

        if (!committed) {
          throw Error('Failed to update');
        }

        if (committed) {
          const ref = firebase.ref(`${routes.courses}/${courseId}/likes/`);
          return ref.transaction((likes: number) => {
            const likesNumber = this.processCourseLikes(likes, result);
            return likesNumber;
            });
          }
      });
    } catch (error) {
      console.log(error);
    }
  }

  private processUserLikes(coursesIds: string[], courseId): any {
    if (coursesIds?.length && coursesIds.includes(courseId)) {
      const index = coursesIds.indexOf(courseId);
      coursesIds.splice(index, 1);
      return { coursesIds, likesCount: -1 };
    }

    if (coursesIds?.length && !(coursesIds.includes(courseId))){
      coursesIds.push(courseId);
      return { coursesIds, likesCount: 1};
    }

    if (!coursesIds) {
      coursesIds = [];
      coursesIds.push(courseId);
      return { coursesIds, likesCount: 1};
    }
  }

  private processCourseLikes(likesNumber: number, point: number) {
    if (likesNumber < 1) {
      likesNumber = 1;
      return likesNumber;
    }

    if (likesNumber && (typeof likesNumber === 'number')) {
      likesNumber += point;
      return likesNumber;
    }
  }
}
