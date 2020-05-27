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
  fireBase: any;
  fireStorage: any;
  fireBaseAuth: any;

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

  public getFirebaseReference() {
    return this.fireBase;
  }

  public getFireStorageReference() {
    return this.fireStorage;
  }

  public getFireBaseAuthReference() {
    return this.fireBaseAuth;
  }

  public getAuthUser(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.fireBaseAuth.onAuthStateChanged((user: any) => {
        setTimeout(() => resolve(user), 100);
      });
    });
  }
}
