import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersService } from './users.service';
import { User } from '../../models/user/user';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class UsersResolver implements Resolve<User[]> {
  constructor(private usersService: UsersService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User[]> {
    return this.usersService.loadUsers().pipe(take(1));
  }
}
