import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CoursesService } from '../shared/services/courses/courses.service';
import { UsersService } from '../shared/services/users/users.service';
import { AuthService } from '../shared/services/auth/auth.service';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { User } from 'src/shared/models/user';
import { USERS } from '../shared/services/mock';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  displayedComponent: number;
  isLoggedIn: boolean;
  authUser: User;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private courseService: CoursesService,
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
   this.initServices();
  }

  initServices() {
    this.courseService.init();
    this.usersService.init();
    this.authService.init();

    this.isLoggedIn = this.authService.isLoggedIn;
    this.authUser = this.authService.getAuthUser();
  }

  // temparary login

  fakeLogIn() {
    if (!this.isLoggedIn) {
      this.authService.setUser(USERS[2]);
      this.isLoggedIn = true;
    } else {
      this.authService.setUser(undefined);
      this.isLoggedIn = false;
    }
  }

  onNavLinkClick(contentId: number): void {
    this.displayedComponent = contentId;
    console.log(this.displayedComponent);
  }
}
