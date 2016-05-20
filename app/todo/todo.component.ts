import {Component, OnInit} from '@angular/core';
import {TodoService} from '../common/todo.service';
import {Todo} from '../common/todo.model'
import { NgClass } from '@angular/common';
import {AddTodoComponent} from './addtodo.component'

@Component({
  selector: 'todo',
  template: `
  <div class="page-header m-t-1">
    <h1>{{title}}}</h1>
  </div>
  <hr>
  <ul class="list-group">
    <li *ngFor="let todo of todos" class="list-group-item" [ngClass]= "{foo : todo.status === 'Completed'}">
      <span>{{ todo.note}} </span>
      <span class="label label-default label-pill pull-xs-right">{{todo.created}} </span>
      <span class="label label-default label-pill pull-xs-right">{{todo.priority}}</span>
    </li>
  </ul>
  <addtodo></addtodo>
  <div class="error" *ngIf="errorMessage">{{errorMessage}}</div>`,
  providers: [TodoService],
  directives: [AddTodoComponent]
})

export class TodoComponent implements OnInit {
  constructor(private todoService: TodoService) { }
  title: string
  errorMessage: string;
  todos: Todo[];
  ngOnInit() {
    this.getTodos();
    this.title = 'Todo List'
  }
  getTodos() {
    this.todoService.getTodos()
      .subscribe(
      todos => this.todos = todos,
      error => this.errorMessage = error);
  }
}

