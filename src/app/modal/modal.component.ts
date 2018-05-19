import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, CloseModalAction } from '../app.component.rx';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  description: string;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
  }

  closeModal() {
    this.store.dispatch(new CloseModalAction());
  }
}
