import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-user-pic',
  templateUrl: './user-pic.component.html',
  styleUrls: ['./user-pic.component.scss']
})
export class UserPicComponent implements OnInit {

  @Input() image;
  @Input() name;
  constructor() { }

  ngOnInit(): void {
  }

}
