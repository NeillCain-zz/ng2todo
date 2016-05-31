import {Component, OnInit, Output, Input, EventEmitter, ViewChild} from '@angular/core';
import {Control, FORM_DIRECTIVES, NgClass} from '@angular/common';
import {TodoService} from '../common/todo.service';
import {Todo} from '../common/todo.model'
import {AddTodoComponent} from './addtodo.component'
import {TodoSearchComponent } from './todoSearch.component'
import {Observable, Observer} from 'rxjs/Rx';
import { ToastyService, Toasty, ToastOptions, ToastData } from 'ng2-toasty/ng2-toasty';
import 'ng2-toasty/ng2-toasty.css';

@Component({
  selector: 'todo',
  template: `
  <div class="page-header m-t-1">
    <h1>{{title}}</h1>
  </div>
  <hr>
  <todo-search [todos]="todos"></todo-search>
  <addtodo></addtodo>
  <ng2-toasty></ng2-toasty>
  <div class="error" *ngIf="errorMessage">{{errorMessage}}</div>`,
  providers: [TodoService],
  directives: [AddTodoComponent, TodoSearchComponent, FORM_DIRECTIVES, Toasty]
})

export class TodoComponent implements OnInit {
  @ViewChild(TodoSearchComponent) todoSearchComponent: TodoSearchComponent;
  private title: string;
  private errorMessage: string;
  private todos: Todo[] = [];

  constructor(private todoService: TodoService, private toastyService:ToastyService) {
  }

  ngOnInit() {
    this.title = 'Todo List'
  }

  ngAfterViewInit() {
    this.toastie({foo: 'initialised'});
    this.todoSearchComponent.searchEvent
      .startWith({take: 10, skip: 0 })
      .flatMap(searchEvent => this.todoService.getTodos(searchEvent.skip, searchEvent.take))
      .subscribe(result => { this.todos = result }, error => this.errorMessage = error)
  }

  private toastie(data){
    let message = JSON.stringify(data);

    let toastOptions: ToastOptions = {
            title: 'Something happended on todo service',
            msg: message,
            showClose: true,
            timeout: 3000
        };

        this.toastyService.default(toastOptions)
  }
}
