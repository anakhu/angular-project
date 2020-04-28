import { Injectable } from '@angular/core';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUser: User | undefined;
  isLoggedIn: boolean;

  constructor() {}

  getAuthUser(): User {
    return this.authUser;
  }

  // make private
  setUser(user: User): void {
    console.log('setting user');
    this.authUser = user;
  }

  private loadUser() {
    const user = window.localStorage.getItem('user');
    if (!user) {
      this.isLoggedIn = false;
    } else {
      try {
        this.setUser(JSON.parse(user));
        this.isLoggedIn = true;
      } catch (error) {
        console.log(error.message);
        console.log('failed to load a user');
      }
    }
  }

  init() {
    this.loadUser();
  }
}
