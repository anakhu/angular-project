import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-user-thumb',
  templateUrl: './user-thumb.component.html',
  styleUrls: ['./user-thumb.component.scss']
})
export class UserThumbComponent implements OnInit {
  @Input() user: User | Partial <User>;
  constructor() { }

  ngOnInit(): void {}

}
