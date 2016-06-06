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
  styles: [`
    li.important {
      border-left: 3px solid red;
      border-right: 3px solid red;
    }
  `],
  template: `
  <div class="page-header row m-t-1">
    <div class="col-sm-6"><h1>{{title}}</h1></div>
    <div class="btn-group btn-group-lg col-sm-6" role="group" aria-label="toolbar">
      <button (click)="wantsToAdd = !wantsToAdd" type="button" class="btn btn-secondary-outline">Add</button>
      <button (click)="triggerSearch($event)" type="button" class="btn btn-secondary-outline">Refresh</button>
    </div>
  </div>
  <hr>
  <addtodo *ngIf="wantsToAdd"></addtodo>
  <todo-edit (doneEvent)="onEditDone($event)" *ngIf="selectedTodo" [todo]="selectedTodo"></todo-edit>
  <todo-search [showDivs]="false"></todo-search>
  <ul class="list-group">
    <li (click)="onSelect(todo)" *ngFor="let todo of todos" class="list-group-item" [ngClass]= "{important : todo.priority > 5}">
      <span>{{todo.note}} </span>
      <span class="label label-default pull-xs-right label-pill">{{todo.created}} </span>
      <span class="label label-default pull-xs-right label-pill">{{todo.priority}}</span>
      <span class="label pull-xs-right" [ngClass]= "{'label-success' : todo.status === 'Completed'}">Completed</span>
    </li>
  </ul>
  <ng2-toasty></ng2-toasty>
  <div class="error" *ngIf="errorMessage">{{errorMessage}}</div>`,
  directives: [AddTodoComponent, EditTodoComponent, TodoSearchComponent, FORM_DIRECTIVES, Toasty]
})

export class TodoComponent implements OnInit {
  @ViewChild(TodoSearchComponent) todoSearchComponent: TodoSearchComponent;
  private title: string;
  private wantsToAdd: boolean = false;
  private errorMessage: string;
  private todos: Todo[] = [];
  private selectedTodo: Todo;

  constructor(private todoService: TodoService, private toastyService: ToastyService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.title = 'Todo List'
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

  private triggerSearch(event) {
    console.log('ffs how do you search again', event)
    //this.todoSearchComponent.searchEvent.publish()
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
