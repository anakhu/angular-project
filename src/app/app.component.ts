import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CoursesService } from '../shared/services/courses.service';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

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

  constructor(
    private breakpointObserver: BreakpointObserver,
    private courseService: CoursesService,
  ) {}

  ngOnInit(): void {
    this.courseService.init();
  }

  onNavLinkClick(contentId: number): void {
    this.displayedComponent = contentId;
    console.log(this.displayedComponent);
  }
}
