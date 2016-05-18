import {Component, OnInit} from '@angular/core';
import {StateService} from '../common/state.service';
import {AlertComponent} from 'ng2-bootstrap/ng2-bootstrap';

@Component({
  selector: 'home',
  template: `
  <div class="page-header m-t-1">
    <h1>{{ title }}</h1>
  </div>
  <hr>
  <div>
    <alert type="info">Message {{ message }} - Today: {{ date.toDateString() }}</alert>
    <form class="form-inline">
      <input type="text" [(ngModel)]="message" placeholder="Message">
      <button type="submit" class="btn btn-primary-outline" (click)="updateMessage(message)">Update Message</button>
    </form>
  </div>`,
  directives: [AlertComponent]
})
export class HomeComponent implements OnInit {
  title: string = 'Home';
  date: Date = new Date();
  message: string;

  constructor(private _stateService: StateService) { }

  ngOnInit() {
    this.message = this._stateService.getMessage();
  }

  updateMessage(m: string): void {
    this._stateService.setMessage(m);
  }
}
