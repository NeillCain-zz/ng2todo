import {Component, OnInit, Output, Input, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import {Control, FORM_DIRECTIVES, NgClass} from '@angular/common';
import {TodoService} from '../common/todo.service';
import {Todo} from '../common/todo.model'
import {AddTodoComponent} from './addtodo.component'
import {TodoSearchComponent } from './todoSearch.component'
import {Observable, Observer} from 'rxjs/Rx';
import { ToastyService, Toasty, ToastOptions, ToastData } from 'ng2-toasty/ng2-toasty';
import { FooBarService } from '../common/foobar.service'
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

  constructor(private todoService: TodoService, private toastyService: ToastyService, private cdr: ChangeDetectorRef, private foobarService: FooBarService) {
    console.log('constructing TODO component');
    console.log('getFoo', foobarService.getFoo());
  }


  ngOnInit() {
    console.log('ngOnInit TODO component');
    this.title = 'Todo List'
  }
  ngOnDestroy() {
    console.log('ngOnDestroy TODO component');
    // Speak now or forever hold your peace
  }
  ngDoCheck() {
    console.log('ngDoCheck TODO component');
    // Custom change detection
  }
  ngOnChanges(changes) {
    console.log('ngOnChanges TODO component');
    // Called right after our bindings have been checked but only
    // if one of our bindings has changed.
    //
    // changes is an object of the format:
    // {
    //   'prop': PropertyUpdate
    // }
  }
  ngAfterContentInit() {
    console.log('ngAfterContentInit TODO component');
    // Component content has been initialized
  }
  ngAfterContentChecked() {
    console.log('ngAfterContentChecked TODO component');
    // Component content has been Checked
  }
  ngAfterViewInit() {
    console.log('ngAfterViewInit TODO component');
    this.toastie('initialised');
    //this.todoService.cacheUpdatedEvent.subscribe(message => {
      //this.toastie
    //})

    this.todoSearchComponent.searchEvent
      .startWith({ take: 10, skip: 0 })
      .flatMap(searchEvent => this.todoService.getTodos(searchEvent.skip, searchEvent.take))
      .subscribe(result => { this.todos = result }, error => this.errorMessage = error)

      this.cdr.detectChanges();
  }
  ngAfterViewChecked() {
    console.log('ngAfterViewChecked TODO component');
    // Component views have been checked
  }

  private toastie(message: string) {
    let toastOptions: ToastOptions = {
      title: 'Something happended on todo service',
      msg: message,
      showClose: true,
      timeout: 3000
    };

    this.toastyService.default(toastOptions)
  }
}
