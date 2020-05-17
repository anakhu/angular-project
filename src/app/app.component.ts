import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from './shared/services/auth/auth.service';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginUser } from './shared/services/auth/login.user';

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
    this.authService.getLoginUserOnAppLoad();
  }

  ngOnInit(): void {
   this.authSubscription = this.authService.createSubscription()
    .subscribe((user: LoginUser) => {
     this.authUserId = user ? user.id : null;
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
