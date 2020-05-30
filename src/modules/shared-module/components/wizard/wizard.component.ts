import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild, OnChanges, ComponentFactory } from '@angular/core';
import { AnchorDirective } from './anchor.directive';
import { StepBase } from './step-.base';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit, OnChanges {
  public isShown = false;
  public step = 1;
  private componentSubscription: Subscription;

  @Input() componentList;
  @Input() name;
  @ViewChild(AnchorDirective, {static: true}) stepHost: AnchorDirective;
  constructor(private componentFactoryResolver: ComponentFactoryResolver){}

  ngOnInit(): void {
    this.loadComponent();
  }

  ngOnChanges(): void {
  }

  public loadComponent(): void {
    const componentFactory = this.componentFactoryResolver
      .resolveComponentFactory(this.componentList[this.step]);

    const viewContainerRef = this.stepHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    this.componentSubscription = (componentRef.instance as StepBase).next
      .subscribe(this.onStepChange.bind(this));
  }

  public onStepChange(data) {
    this.componentSubscription.unsubscribe();
    if (data.nextStep === 0) {
      this.isShown = false;
      this.step = 1;
      this.stepHost.viewContainerRef.clear();
      this.loadComponent();
      return false;
    }
    this.step = data.nextStep;
    this.loadComponent();
  }

  onClick() {
    this.isShown = false;
  }
}
