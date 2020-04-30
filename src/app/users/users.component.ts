import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../shared/models/user';
import { UsersService } from '../../shared/services/users/users.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/shared/services/auth/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[];
  authStatus: boolean;
  usersSubscription: Subscription;
  authSubscription: Subscription;

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
   this.createAuthStatusSubscription();
   this.createUserSubscription();
  }

  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

  private createAuthStatusSubscription(): void {
    this.authSubscription = this.authService.createSubscription()
      .subscribe((authStatus: boolean) => this.authStatus = authStatus);
  }

  private createUserSubscription(): void {
    this.usersSubscription = this.usersService.createSubscription()
      .subscribe((users: User[]) => {
        if (this.authStatus) {
          const id = this.authService.getAuthUserId();
          this.users = users
            .filter(({id: userId}: User ) => userId !== id);
        } else {
          this.users = users;
        }
      });
  }
}
