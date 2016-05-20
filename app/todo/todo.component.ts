import {Component, OnInit, Output, Input, EventEmitter} from '@angular/core';
import {Control, FORM_DIRECTIVES, NgClass} from '@angular/common';
import {TodoService} from '../common/todo.service';
import {Todo} from '../common/todo.model'
import {AddTodoComponent} from './addtodo.component'
import {TodoSearchComponent } from './todoSearch.component'
import {Observable, Observer} from 'rxjs/Rx';

@Component({
  selector: 'todo',
  template: `
  <div class="page-header m-t-1">
    <h1>{{title}}</h1>
  </div>
  <hr>
  <todo-search (searchEvent)="onSearch($event)" [results]="data"></todo-search>
  <addtodo></addtodo>
  <div class="error" *ngIf="errorMessage">{{errorMessage}}</div>`,
  providers: [TodoService],
  directives: [AddTodoComponent, TodoSearchComponent, FORM_DIRECTIVES]
})

export class TodoComponent implements OnInit {
  private data:Observable<any>;
  private dataObserver:Observer<any>;
  title: string
  errorMessage: string;

  constructor(private todoService: TodoService) {
    this.data = new Observable(observer => this.dataObserver = observer);
  }

  ngOnInit() {
    this.onSearch({skip: 0, take: 10});
    this.title = 'Todo List'
  }

  onSearch(event) {
    console.log('onSearch Event', event)
    this.todoService.getTodos(event.skip, event.take)
	  .subscribe(result => {
	   this.dataObserver.next(result);
	 }, error => this.errorMessage = error);
	}
}
