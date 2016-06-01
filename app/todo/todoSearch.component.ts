import {Control, FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators} from '@angular/common';
import {Component, Output, Input, EventEmitter} from '@angular/core';
import {Todo} from '../common/todo.model';
import {AddTodoComponent} from './addtodo.component'
import {Observable} from 'rxjs/Rx';
import {EditTodoComponent} from './todoEdit.component'

@Component({
	selector: 'todo-search',
	directives: [FORM_DIRECTIVES, EditTodoComponent, AddTodoComponent],
	template: `
	<form [ngFormModel]="searchForm">
		<div class="row">
			<div class="form-group col-sm-6" [ngClass]="{ 'has-danger' : !skip.valid }">
				<label class="form-control-label" for="skip">Skip</label>
				<input #skipBar [ngFormControl]="skip" placeholder="SKIP" [(ngModel)]="skip1EventFireHack" type="text" class="form-control" [ngClass]="{ 'form-control-danger' : !skip.valid }">
			</div>
			<div class="form-group col-sm-6" [ngClass]="{ 'has-danger' : !take.valid }">
				<label class="form-control-label" for="username">Take</label>
				<input #takeFoo [ngFormControl]="take" placeholder="TAKE" [(ngModel)]="take1EventFireHack" type="text" class="form-control" [ngClass]="{ 'form-control-danger' : !take.valid }">
			</div>
		</div>
	</form>
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
		<div class="row">
		<div class="col-sm-6" style="height: 300px; background-color: red;" (mouseover)="onMouseOver($event, takeFoo, skipBar)">Click me</div>
		<div class="col-sm-6" style="height: 300px; background-color: blue;" (mousemove)="onMouseMove($event, takeFoo, skipBar)">Click me</div>
	</div>
	`
})
export class TodoSearchComponent {
	private searchForm: ControlGroup;
  private skip: Control = new Control('0', Validators.required);
  private take: Control = new Control('10', Validators.required);
	private take1EventFireHack: number = 10;
	private skip1EventFireHack: number = 0;

  @Input() todos: Todo[];
  @Output() searchEvent: EventEmitter<any> = new EventEmitter();

	selectedTodo: Todo;

	constructor(private builder: FormBuilder) {
		this.skip.valueChanges.debounceTime(400).startWith(0)
			.combineLatest(this.take.valueChanges.debounceTime(400).startWith(10), (skip, take) => ({ skip, take }))
			.subscribe(x => {
				console.log('search event fired', x);
				this.searchEvent.emit(x)
			})

		this.searchForm = builder.group({
      skip: this.skip,
      take: this.take,
    });
  }

	onMouseOver(event, take, skip) {
		console.log(event, take, skip);
	}

	onMouseMove(event, take, skip) {
		console.log(event, take, skip);
	}

	onEditDone(foo: any) {
		this.selectedTodo = undefined;
	}

	onSelect(todo: Todo) {
		this.selectedTodo = Object.assign({}, todo);
	}
}