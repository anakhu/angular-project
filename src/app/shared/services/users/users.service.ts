import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import {
  of,
  from,
  Observable,
  Subject,
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
import { ApiService, Update } from '../api/api.service';
import { routes } from '../../../../environments/environment';
import { AppService } from '../app/app.service';
import { Follower } from '../followers/follower.interface';
import { NewUser } from './user';
import { UploadService, UploadUpdate } from '../upload/upload.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable({
  providedIn: 'root'
})

export class UsersService {
  private users: User[] = [];
  private userSubject = new Subject<User[]>();

  constructor(
    private api: ApiService,
    private app: AppService,
    private uploads: UploadService,
    private loader: NgxUiLoaderService
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
      .on('child_changed', (data: any) => {
        this.updateLocalUsers(data.key, data.val());
      });
  }

  public updateUserDetail(updatedUser: User): Observable<User> {
    const { id } = updatedUser;
    return this.api.updateEntry(`${routes.users}/${id}/`, updatedUser);
  }

  public addUser(payloadData: Partial<User>): Observable<any> {
    return from(this.createAccount(payloadData))
      .pipe(
        tap((user: User) => {
          this.users.push(user);
          this._setUsers(this.users);
        })
      );
  }

  public deleteUser(userId: string): Observable<boolean> {
    return this.deleteAccount(userId)
      .pipe(
        map((response: boolean) => {
          if (response) {
            this.updateLocalUsers(userId);
          }
          return response;
        })
      );
  }

  public getUser(id: string): Observable<User | Error> {
    return from(this.users)
      .pipe(
        find(({id: userId}: User) => userId === id),
        concatMap((result: User | undefined) => {
          if (!result) {
            // const error = new Error('User not found');
            // this.errors.handleError(error);
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


  public deleteAccount(userId: string): Observable<any> {
    return this.blockAccount(userId)
      .pipe(
        concatMap((result) => {
          if (!(result instanceof Error)) {
            return this.getFollowersOnDelete(userId);
          }
        }),
        map((data: Update[]) => {
          const userRef: Update = {
            collection: routes.users,
            docs: userId,
          };
          return [...data, userRef];
        }),
        concatMap((updates: Update[]) => {
          return this.api.deleteSimultaneously(updates);
        })
      );
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

  public changeProfilePicture(userId: string, image: File ) {
    return this.uploads.sendFile(image, routes.users, userId)
      .pipe(
        exhaustMap((data: UploadUpdate) => {
          if (!(data instanceof Error)) {
            return this.api.updateEntry(`${routes.users}/${userId}/`, {image: data.image});
          }
        })
      );
  }

  private updateLocalUsers(userId: string, updatedUser: User = null) {
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
