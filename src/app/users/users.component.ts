import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../shared/models/user';
import { UsersService } from '../../shared/services/users/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[];
  selectedUserId: number;
  usersSubscription: Subscription;

  constructor(
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {
    this.usersSubscription = this.usersService.createSubscription()
      .subscribe((users: User[]) => this.users = users);
  }

  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
  }

  setUserId(userId: number): void {
    this.selectedUserId = userId;
  }

}
