import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/auth';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AppService {
  fireBase: firebase.database.Database;
  fireStorage: firebase.storage.Storage;
  fireBaseAuth: firebase.auth.Auth;

  constructor() {
    this.initApp();
  }

  public initApp() {
    firebase.initializeApp({
      ...environment
    });
    this.fireBase = firebase.database();
    this.fireStorage = firebase.storage();
    this.fireBaseAuth = firebase.auth();
  }

  public getFirebaseReference(): firebase.database.Database {
    return this.fireBase;
  }

  public getFireStorageReference(): firebase.storage.Storage {
    return this.fireStorage;
  }

  public getFireBaseAuthReference(): firebase.auth.Auth {
    return this.fireBaseAuth;
  }

  public getAuthUser(): Promise<firebase.User>{
    return new Promise((resolve, reject) => {
      this.fireBaseAuth.onAuthStateChanged((user: firebase.User) => {
        setTimeout(() => resolve(user), 100);
      });
    });
  }
}
