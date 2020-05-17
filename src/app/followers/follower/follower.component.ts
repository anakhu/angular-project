import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-follower',
  templateUrl: './follower.component.html',
  styleUrls: ['./follower.component.scss']
})
export class FollowerComponent implements OnInit {
  @Input() user: User;

  constructor() { }

  ngOnInit(): void {
  }

}
