import {Control, FORM_DIRECTIVES} from '@angular/common';
import {Component, Output, Input, EventEmitter} from '@angular/core';
import {Observable} from 'rxjs/Rx';

@Component({
	selector: 'todo-search',
	directives: [FORM_DIRECTIVES],
	template: `
	<input [ngFormControl]="skipBox" placeholder="SKIP" />
  <input [ngFormControl]="takeBox" placeholder="TAKE" />
	<ul class="list-group">
    <li *ngFor="let todo of results | async" class="list-group-item" [ngClass]= "{foo : todo.status === 'Completed'}">
      <span>{{todo.note}} </span>
      <span class="label label-default label-pill pull-xs-right">{{todo.created}} </span>
      <span class="label label-default label-pill pull-xs-right">{{todo.priority}}</span>
    </li>
  </ul>
	`
})
export class TodoSearchComponent {
  private skipBox:Control = new Control();
  private takeBox:Control = new Control();
	private skip:number = 0;
	private take:number = 10;

  @Input() results:Observable<any>;
  @Output() searchEvent: EventEmitter<any> = new EventEmitter();

  constructor() {
		this.skipBox.valueChanges.subscribe((value) => {
			console.log('skipBox Event', value)
			this.skip = value;
			this.searchEvent.emit({skip: this.skip, take: this.take});
		});
    this.takeBox.valueChanges.subscribe((value) => {
			console.log('takeBox Event', value)
			this.take = value;
			this.searchEvent.emit({skip: this.skip, take: this.take})
		});
  }
}