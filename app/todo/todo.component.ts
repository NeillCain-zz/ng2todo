import {Component, OnInit, Output, Input, EventEmitter, ViewChild} from '@angular/core';
import {Control, FORM_DIRECTIVES, NgClass} from '@angular/common';
import {TodoService} from '../common/todo.service';
import {Todo} from '../common/todo.model'
import {AddTodoComponent} from './addtodo.component'
import {TodoSearchComponent } from './todoSearch.component'
import {Observable, Observer} from 'rxjs/Rx';
import * as sio from 'socket.io-client';
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
  private socket: SocketIOClient.Socket;

  constructor(private todoService: TodoService, private toastyService:ToastyService) {
  }

  ngOnInit() {
    this.title = 'Todo List'
    this.socket = sio.connect('ws://todo.kungfoobar.me');
    this.socket.on('post', data => {
      console.log('post socket', data)
      this.toastie(data)
    })
    this.socket.on('put', data => {
      console.log('put socket', data)
      this.toastie(data)
    })
  }

  ngAfterViewInit() {
    this.toastie({foo: 'initialised'});
    this.todoSearchComponent.searchEvent
      .flatMap(searchEvent => this.todoService.getTodos(searchEvent.skip, searchEvent.take))
      .subscribe(result => {
        console.log('result', result);
        this.todos = result;
      }
      , error => this.errorMessage = error);
  }

  private toastie(data){
    let message = JSON.stringify(data);

    let toastOptions: ToastOptions = {
            title: 'Something happended on todo service',
            msg: message,
            showClose: true,
            timeout: 5000,
            onAdd: (toast: ToastData) => {
                console.log('Toast ' + toast.id + ' has been added!');
            },
            onRemove: function(toast: ToastData) {
                console.log('Toast ' + toast.id + ' has been removed!');
            }
        };

        this.toastyService.default(toastOptions)
        // switch (this.options.type) {
        //     case 'default': this.toastyService.default(toastOptions); break;
        //     case 'info': this.toastyService.info(toastOptions); break;
        //     case 'success': this.toastyService.success(toastOptions); break;
        //     case 'wait': this.toastyService.wait(toastOptions); break;
        //     case 'error': this.toastyService.error(toastOptions); break;
        //     case 'warning': this.toastyService.warning(toastOptions); break;
        // }
  }
}
