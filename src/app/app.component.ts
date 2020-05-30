import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService, FireBaseUser } from './shared/services/auth/auth.service';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginUser } from './shared/services/auth/login.user';
import { ApiService } from './shared/services/api/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  isHandset$: Observable<boolean> = this.breakpointObserver
  .observe(Breakpoints.Handset)
    .pipe(
      tap((res) => console.log(res)),
      map(result => result.matches),
      shareReplay()
    );

  mediaSub: Subscription;
  authSubscription: Subscription;
  authUserId: string;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.createSubscription()
      .subscribe((user: FireBaseUser) => {
      this.authUserId = user ? user.uid : null;
      console.log(this.authUserId);
      });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
