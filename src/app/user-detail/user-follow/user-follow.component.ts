import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-user-follow',
  templateUrl: './user-follow.component.html',
  styleUrls: ['./user-follow.component.scss']
})
export class UserFollowComponent implements OnInit {

  @Input() followers;
  @Input() title;

  constructor() { }

  ngOnInit(): void {
  }

}
