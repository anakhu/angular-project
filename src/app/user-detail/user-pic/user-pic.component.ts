import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-user-pic',
  templateUrl: './user-pic.component.html',
  styleUrls: ['./user-pic.component.scss']
})
export class UserPicComponent implements OnInit {
  @Input() user;
  followersNum: number;
  followingsNum: number;

  constructor() { }

  ngOnInit(): void {}

}
