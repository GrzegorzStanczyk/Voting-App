import {
  Component,
  ComponentFactoryResolver,
  ViewContainerRef,
  ComponentFactory,
  OnInit} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState, User, CheckAuthenticationAction } from './app.component.rx';
import { SpinnerComponent } from './spinner/spinner.component';
import { ModalComponent } from './modal/modal.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  spinner: ComponentFactory<SpinnerComponent>;
  modal: ComponentFactory<ModalComponent>;
  user$: Observable<User>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private store: Store<AppState>) {
      this.spinner = this.componentFactoryResolver.resolveComponentFactory(SpinnerComponent);
      this.modal = this.componentFactoryResolver.resolveComponentFactory(ModalComponent);
      this.user$ = this.store.pipe(select(state => state.voteApp.user));

      store.pipe(select(state => state.voteApp.pending))
      .subscribe(pending => {
        if (pending) {
          this.viewContainerRef.createComponent(this.spinner);
        } else {
          this.viewContainerRef.clear();
        }
      });

      store.pipe(select(state => state.voteApp.modalMsg))
      .subscribe(msg => {
        if (msg) {
          const modal = this.viewContainerRef.createComponent(this.modal);
          modal.instance.description = msg;
          modal.changeDetectorRef.detectChanges();
        } else {
          this.viewContainerRef.clear();
        }
      });
    }
  ngOnInit() {
    this.store.dispatch(new CheckAuthenticationAction());
  }
}
