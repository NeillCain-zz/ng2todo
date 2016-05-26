import {Control, FORM_DIRECTIVES} from '@angular/common';
import {Component, Output, Input, EventEmitter} from '@angular/core';
import {Todo} from '../common/todo.model';
import {Observable} from 'rxjs/Rx';
import {EditTodoComponent} from './todoEdit.component'

@Component({
	selector: 'todo-search',
	directives: [FORM_DIRECTIVES, EditTodoComponent],
	template: `
	<input [ngFormControl]="skipBox" placeholder="SKIP" />
  <input [ngFormControl]="takeBox" placeholder="TAKE" />
	<ul class="list-group">
    <li (click)="onSelect(todo)" *ngFor="let todo of todos" class="list-group-item" [ngClass]= "{foo : todo.status === 'Completed'}">
      <span>{{todo.note}} </span>
      <span class="label label-default label-pill pull-xs-right">{{todo.status}} </span>
      <span class="label label-default label-pill pull-xs-right">{{todo.created}} </span>
      <span class="label label-default label-pill pull-xs-right">{{todo.priority}}</span>
    </li>
  </ul>
	<hr>
	<todo-edit (doneEvent)="onEditDone($event)" *ngIf="selectedTodo" [todo]="selectedTodo"></todo-edit>
	`
})
export class TodoSearchComponent {
  private skipBox:Control = new Control();
  private takeBox:Control = new Control();
	private skip:number = 0;
	private take:number = 10;

  @Input() todos:Todo[];
  @Output() searchEvent: EventEmitter<any> = new EventEmitter();

	selectedTodo: Todo;

	constructor() {
		this.skipBox.valueChanges
			.combineLatest(this.takeBox.valueChanges, (skip, take) => ({skip, take}))
			.subscribe(x => this.searchEvent.emit(x));
  }

	onEditDone(foo: any){
		this.selectedTodo = undefined;
	}

	onSelect(todo: Todo){
		this.selectedTodo = todo;
	}
}