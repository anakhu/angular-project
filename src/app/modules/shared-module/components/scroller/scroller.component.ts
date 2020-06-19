import { Component, OnInit,  ElementRef, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { Subscription, of, interval } from 'rxjs';
import { tap, takeWhile, switchMap, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-scroller',
  templateUrl: './scroller.component.html',
  styleUrls: ['./scroller.component.scss']
})
export class ScrollerComponent implements OnInit, OnDestroy, AfterViewInit{
  @ViewChild('upBtn', {static: true}) upBtn: ElementRef;
  parentElement: ElementRef;
  scrollEventSubscsription: Subscription;
  isShown: boolean;

  constructor(
    private scrollDetector: ScrollDispatcher,
  ) { }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.scrollEventSubscsription.unsubscribe();
  }

  ngAfterViewInit() {
    this._subscribeToScrollChanges();
  }

  public handleClick(event: Event) {
    let top = this.parentElement.nativeElement.scrollTop;
    let speed = 5;
    of(event)
      .pipe(
        debounceTime(2000),
        switchMap(() => interval(5).pipe(
          takeWhile(() => top > 0),
          tap(() => {
            top -= speed;
            this.parentElement.nativeElement.scrollTop = top;
            speed++;
          })
        ))
      )
      .subscribe(() => {});
  }

  private _subscribeToScrollChanges() {
    if (this.upBtn && !this.scrollEventSubscsription) {
      this.scrollEventSubscsription = this.scrollDetector.ancestorScrolled(this.upBtn, 1000)
        .subscribe((result: any ) =>  {
          if (!this.parentElement) {
            this.parentElement = result.elementRef;
          }
          const { scrollTop, scrollHeight } = result.elementRef.nativeElement;
          this.isShown = scrollTop > 1000;
        });
      }
  }
}
