import {
  Component,
  ComponentFactoryResolver,
  ViewContainerRef,
  ComponentFactory} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from './app.component.rx';
import { SpinnerComponent } from './spinner/spinner.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  factory: ComponentFactory<SpinnerComponent>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private store: Store<AppState>) {
      this.factory = this.componentFactoryResolver.resolveComponentFactory(SpinnerComponent);

      store.pipe(select(state => state.voteApp.pending))
      .subscribe(pending => {
        if (pending) {
          this.viewContainerRef.createComponent(this.factory);
        } else {
          this.viewContainerRef.clear();
        }
      });
    }
}
