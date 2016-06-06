import {Component, OnInit, Output, Input, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import {Control, FORM_DIRECTIVES, NgClass} from '@angular/common';
import {TodoService} from '../common/todo.service';
import {Todo} from '../common/todo.model'
import {AddTodoComponent} from './addtodo.component'
import {TodoSearchComponent } from './todoSearch.component'
import {ToastyMessage} from '../common/toastyMessage.model'
import {Observable, Observer} from 'rxjs/Rx';
import {EditTodoComponent} from './todoEdit.component'
import { ToastyService, Toasty, ToastOptions, ToastData } from 'ng2-toasty/ng2-toasty';

import 'ng2-toasty/ng2-toasty.css';

@Component({
  selector: 'todo',
  template: `
  <div class="page-header m-t-1">
    <h1>{{title}}</h1>
  </div>
  <hr>
  <div class="row">
  <button (click)="triggerSearch($event)" type="button" class="btn btn-primary-outline">Refresh</button>
  </div>
  <addtodo></addtodo>
  <hr />
  <todo-edit (doneEvent)="onEditDone($event)" *ngIf="selectedTodo" [todo]="selectedTodo"></todo-edit>
  <todo-search [showDivs]="false"></todo-search>
  <ul class="list-group">
    <li (click)="onSelect(todo)" *ngFor="let todo of todos" class="list-group-item" [ngClass]= "{foo : todo.status === 'Completed'}">
      <span>{{todo.note}} </span>
      <span class="label label-default label-pill pull-xs-right">{{todo.status}} </span>
      <span class="label label-default label-pill pull-xs-right">{{todo.created}} </span>
      <span class="label label-default label-pill pull-xs-right">{{todo.priority}}</span>
    </li>
  </ul>
  <ng2-toasty></ng2-toasty>
  <div class="error" *ngIf="errorMessage">{{errorMessage}}</div>`,
  directives: [AddTodoComponent, EditTodoComponent, TodoSearchComponent, FORM_DIRECTIVES, Toasty]
})

export class TodoComponent implements OnInit {
  @ViewChild(TodoSearchComponent) todoSearchComponent: TodoSearchComponent;
  private title: string;
  private errorMessage: string;
  private todos: Todo[] = [];
  private selectedTodo: Todo;

  constructor(private todoService: TodoService, private toastyService: ToastyService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.title = 'Todo List'
  }

  private triggerSearch(event) {
    console.log('ffs', event)
    //this.todoSearchComponent.searchEvent.publish()
  }

  ngAfterViewInit() {
    this.todoService.cacheUpdatedEvent.subscribe(notification => {
      this.toastie(notification);
    });

    this.todoSearchComponent.searchEvent
      .switchMap(searchEvent => this.todoService.getTodos(searchEvent.skip, searchEvent.take))
      .subscribe(result => { this.todos = result }, error => this.errorMessage = error)

    this.cdr.detectChanges();

    //LOL UNIT TEST
    //this.todoService.testtodos();
  }

  onSelect(todo: Todo) {
    this.selectedTodo = Object.assign({}, todo);
  }

  onEditDone(foo: any) {
    this.selectedTodo = undefined;
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
