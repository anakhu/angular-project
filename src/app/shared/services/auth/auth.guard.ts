import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { LoggedInUser } from '../../models/user/loggedInUser';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
      return this.authService.createSubscription()
        .pipe(
          take(1),
          map((user: LoggedInUser | null) => {
            if (user) {
              this.router.navigate(['/courses']);
              return false;
            } else {
              return true;
            }
          }),
        );
  }
}

