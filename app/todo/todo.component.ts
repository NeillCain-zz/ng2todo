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
  <todo-search (searchEvent)="onSearch($event)" [todos]="todos"></todo-search>
  <addtodo></addtodo>
  <div class="error" *ngIf="errorMessage">{{errorMessage}}</div>`,
  providers: [TodoService],
  directives: [AddTodoComponent, TodoSearchComponent, FORM_DIRECTIVES]
})

export class TodoComponent implements OnInit {
  title: string
  errorMessage: string;
  
  public todos :Todo[] = []

  constructor(private todoService: TodoService) {
  }

  ngOnInit() {
    this.onSearch({skip: 0, take: 2});
    this.title = 'Todo List'
  }

  onSearch(event) {
    this.todoService.getTodos(event.skip, event.take)
	  .subscribe(result => {      
      this.todos = result;
    }  
	 , error => this.errorMessage = error);
	}
}
