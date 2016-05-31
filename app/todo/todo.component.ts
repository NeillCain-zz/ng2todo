import {Component, OnInit, Output, Input, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import {Control, FORM_DIRECTIVES, NgClass} from '@angular/common';
import {TodoService} from '../common/todo.service';
import {Todo} from '../common/todo.model'
import {AddTodoComponent} from './addtodo.component'
import {TodoSearchComponent } from './todoSearch.component'
import {ToastyMessage} from '../common/toastyMessage.model'
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
  directives: [AddTodoComponent, TodoSearchComponent, FORM_DIRECTIVES, Toasty]
})

export class TodoComponent implements OnInit {
  @ViewChild(TodoSearchComponent) todoSearchComponent: TodoSearchComponent;
  private title: string;
  private errorMessage: string;
  private todos: Todo[] = [];

  constructor(private todoService: TodoService, private toastyService: ToastyService, private cdr: ChangeDetectorRef) {
    console.log('constructing TODO component');
  }

  ngOnInit() {
    this.title = 'Todo List'
  }

  ngAfterViewInit() {
    this.toastie('initialised');
    this.todoService.cacheUpdatedEvent.subscribe(notification => {
      this.toastie(notification);
    });

    this.todoSearchComponent.searchEvent
      .startWith({ take: 10, skip: 0 })
      .flatMap(searchEvent => this.todoService.getTodos(searchEvent.skip, searchEvent.take))
      .subscribe(result => { this.todos = result }, error => this.errorMessage = error)

      this.cdr.detectChanges();
  }

  private toastie(notification) {
    let toastOptions: ToastOptions = {
      title: 'Toastie',
      msg: notification.message,
      showClose: true,
      timeout: 3000
    };

    this.toastyService.default(toastOptions)
  }
}
