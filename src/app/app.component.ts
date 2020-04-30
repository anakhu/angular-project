import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CoursesService } from '../shared/services/courses/courses.service';
import { UsersService } from '../shared/services/users/users.service';
import { AuthService } from '../shared/services/auth/auth.service';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LikesService } from 'src/shared/services/likes/likes.service';

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
  displayedComponent: number;
  authStatus: boolean;
  authUserId: number;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private courseService: CoursesService,
    private usersService: UsersService,
    private authService: AuthService,
    private likesService: LikesService,
    private router: Router,
  ) {}

  ngOnInit(): void {
   this.authSubscription = this.authService.createSubscription()
    .subscribe((authStatus: boolean) => {
      this.authStatus = authStatus;
      if (this.authStatus) {
        this.authUserId = this.authService.getAuthUserId();
      }
    });
   this.initServices();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  private initServices() {
    this.courseService.init();
    this.usersService.init();
    this.authService.init();
    this.likesService.init();
  }

  logout(): void {
    this.authService.logUserOut();
    this.router.navigate(['/']);
  }
}
