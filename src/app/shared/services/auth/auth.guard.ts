import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService, FireBaseUser } from './auth.service';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

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
          map((user: FireBaseUser | null) => {
            if (user) {
              console.log('false');
              this.router.navigate(['/courses']);
              return false;
            } else {
              return true;
            }
          }),
        );
  }
}

