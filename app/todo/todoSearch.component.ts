import {Control, FORM_DIRECTIVES} from '@angular/common';
import {Component, Output, Input, EventEmitter} from '@angular/core';
import {Todo} from '../common/todo.model';
import {AddTodoComponent} from './addtodo.component'
import {Observable} from 'rxjs/Rx';
import {EditTodoComponent} from './todoEdit.component'

@Component({
	selector: 'todo-search',
	directives: [FORM_DIRECTIVES, EditTodoComponent, AddTodoComponent],
	template: `
	<input [ngFormControl]="skipBox" placeholder="SKIP" [(ngModel)]='skip' />
  <input [ngFormControl]="takeBox" placeholder="TAKE" [(ngModel)]='take' />
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
  private skipBox: Control = new Control();
  private takeBox: Control = new Control();
	private skip: number = 0;
	private take: number = 10;

  @Input() todos: Todo[];
  @Output() searchEvent: EventEmitter<any> = new EventEmitter();

	selectedTodo: Todo;

	constructor() {
		this.skipBox.valueChanges.startWith(this.skip)
			.combineLatest(this.takeBox.valueChanges.startWith(this.take), (skip, take) => ({ skip, take }))
			.subscribe(x => {
				console.log('search event');
				this.searchEvent.emit(x);
			})
  }

	onEditDone(foo: any) {
		this.selectedTodo = undefined;
	}

	onSelect(todo: Todo) {
		this.selectedTodo = todo;
	}
}