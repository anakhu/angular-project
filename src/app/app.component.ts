import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService, FireBaseUser } from './shared/services/auth/auth.service';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
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
  // loaded: boolean;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this._subscribeToAuthChange();
  }

  private _subscribeToAuthChange(): void {
    this.authSubscription = this.authService.createSubscription()
      .subscribe((user: FireBaseUser) => {
      this.authUserId = user ? user.uid : null;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
