import { Injectable } from '@angular/core';
import { User } from '../../models/user/user';
import {
  of,
  from,
  Observable,
  BehaviorSubject,
} from 'rxjs';
import {
  find,
  map,
  tap,
  concatMap,
  mergeAll,
  pluck,
  toArray,
  exhaustMap,
} from 'rxjs/operators';
import { ApiService } from '../api/api.service';
import { routes } from '../../../../environments/environment';
import { AppService } from '../app/app.service';
import { Follower } from '../../models/followers/follower';
import { NewUser } from './user';
import { UploadService, UploadUpdate } from '../upload/upload.service';
import { Update } from '../../models/update';

@Injectable({
  providedIn: 'root'
})

export class UsersService {
  private users: User[] = [];
  private userSubject = new BehaviorSubject<User[]>([]);

  constructor(
    private api: ApiService,
    private app: AppService,
    private uploads: UploadService,
    ) {
      this._listenToChanges();
    }

  public createSubscription(): Observable<User[]>{
    return this.userSubject.asObservable();
  }

  public loadUsers(): Observable<User[]> {
    return this.api.getCollectionEntries(routes.users)
      .pipe(
        map((users: User[]) => {
          this._setUsers(users);
          return this.users;
        })
      );
  }

  public getUsers(): User[] {
    return this.users;
  }

  private _setUsers(users: User[]): void {
    this.users = users;
    this.userSubject.next(this.users);
  }

  private _listenToChanges() {
    return this.app.getFirebaseReference()
      .ref(routes.users)
      .on('child_changed', (data: firebase.database.DataSnapshot) => {
        this.updateLocalUsers(data.key, data.val());
      });
  }

  public updateUserDetail(updatedUser: User): Observable<User> {
    const { id } = updatedUser;
    return this.api.updateEntry(`${routes.users}/${id}/`, updatedUser);
  }

  public addUser(payloadData: Partial<User>): Observable<User> {
    return from(this.createAccount(payloadData))
      .pipe(
        tap((user: User) => {
          this.users.push(user);
          this._setUsers(this.users);
        })
      );
  }

  public getUser(id: string): Observable<User | null> {
    return from(this.users)
      .pipe(
        find(({id: userId}: User) => userId === id),
        concatMap((result: User | undefined) => {
          if (!result) {
            return of(null);
          } else {
            return of(result);
          }
        })
      );
  }

  public getFollowersOnDelete(userId: string): Observable<Update[]> {
    return from(this.api.getByChildValue(routes.followers, 'followerId', userId))
      .pipe(
        concatMap((followers: Follower[]) => {
          return this.api.getByChildValue(routes.followers, 'userId', userId)
            .pipe(
              map((followings: Follower[]) => {

                return [...followers, ...followings];
              })
            );
        }),
        mergeAll(),
        pluck('id'),
        map((id: string) => {
          const updateRef: Update = {
            collection: routes.followers,
            docs: id,
          };
          return updateRef;
        }),
        toArray()
      );
  }

  public blockAccount(userId: string): Observable<any> {
    return this.api.updateEntry(`${routes.users}/${userId}/`, { isActive: false});
  }

  public createAccount(payloadData: Partial<User>): Observable<User> {
    const {id, name, country, occupation } = payloadData;
    const newUser = new NewUser(id, name, country, occupation, true, null);
    return this.api.addEntry(`${routes.users}/${id}/`, newUser)
      .pipe(
        map((response: User) => {
          if (!(response instanceof Error)) {
            return newUser;
          }
        })
      );
  }

  public changeProfilePicture(userId: string, image: File ): Observable<UploadUpdate> {
    return this.uploads.sendFile(image, routes.users, userId)
      .pipe(
        exhaustMap((data: UploadUpdate) => {
          if (!(data instanceof Error)) {
            return this.api.updateEntry(`${routes.users}/${userId}/`, {image: data.image});
          }
        })
      );
  }

  public updateLoacalUsersOnDelete(userId: string): void {
    const index = this.users.findIndex((user: User) => user.id === userId);
    if (index) {
      this.users.splice(index, 1);
      this._setUsers(this.users);
    }
  }

  private updateLocalUsers(userId: string, updatedUser: User = null): void {
    const index = this.users.findIndex((entry: User) => entry.id === userId);
    if (index !== -1) {
      if (updatedUser) {
        this.users.splice(index, 1, updatedUser);
      } else {
        this.users.splice(index, 1);
      }
      this._setUsers(this.users);
    }
  }


}
