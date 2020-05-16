import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../shared/models/user';
import { UsersService } from '../../shared/services/users/users.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/shared/services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[];
  usersSubscription: Subscription;

  constructor(
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data
      .subscribe((data: {UsersResolver: User[]}) => {
        this.users = data.UsersResolver;
      });

    this.createUserSubscription();
  }

  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
  }

  private createUserSubscription(): void {
    this.usersSubscription = this.usersService.createSubscription()
      .subscribe((users: User[]) => this.users = users);
  }
}
