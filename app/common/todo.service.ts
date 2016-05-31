import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Todo } from './todo.model';
import { ToastyMessage } from './toastyMessage.model'
import { ReplaySubject, Observable } from "rxjs/Rx";
import { Headers, RequestOptions } from '@angular/http';
import { StateService } from './state.service'
import * as sio from 'socket.io-client';

@Injectable()
export class TodoService {
  private todoUrl = 'http://todo.kungfoobar.me/todo';
  private reload: boolean = false;
  private _todos: ReplaySubject<Todo[]> = new ReplaySubject<Todo[]>();
  private socket: SocketIOClient.Socket;
  @Output() cacheUpdatedEvent: EventEmitter<ToastyMessage> = new EventEmitter<ToastyMessage>();

  constructor(private http: Http, private stateService: StateService) {
    this.socket = sio.connect('ws://todo.kungfoobar.me');

    this.socket.on('connect', data => {
      console.log("socket connected");
    });

    this.socket.on('post', data => {
      this.reload
      let currentEtag = this.stateService.getEtag();
      this.notify('New Todo Created, refreshing');
    });

    this.socket.on('put', data => {
      this.reload = true;
      let currentEtag = this.stateService.getEtag();
      this.notify('Todo Updated, refreshing ');
    });
  }

  doSomething():string{
    return 'something';
  }

  getTodos(skip: number, take: number): Observable<Todo[]> {
    console.log('get todos');
    this._todos = this._todos.isUnsubscribed ? new ReplaySubject<Todo[]>(1) : this._todos;
    let todos = this.stateService.getTodos();
    if (todos.length > 0 && !this.reload) {
      todos = this.queryTodos(todos, skip, take)
      this._todos.next(todos);
    }
    else {
      let headers = new Headers();
      if (!this._todos.observers.length) {
        this.http.get(this.todoUrl)
          .subscribe(
          res => {
            this.reload = false;
            let todos = this.cacheData(res)
            todos = this.queryTodos(todos, skip, take)
            this._todos.next(todos);
          },
          error => this._todos.error(error));
      }
    }
    return this._todos;
  }

  addTodo(note: string, priority: number, status: string): Observable<Todo> {
    let todo = { note, priority, status };
    let body = JSON.stringify(todo);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.todoUrl, body, options)
      .map(() => todo)
      .catch(this.handleError);
  }

  edit(todo: Todo) {
    let body = JSON.stringify(todo);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('If-Match', todo.revision);
    let options = new RequestOptions({ headers: headers });
    return this.http.put(this.todoUrl + `/${todo.id}`, body, options)
      .map(() => todo)
      .catch(this.handleError);
  }

  private notify(message: string) {
    this.cacheUpdatedEvent.emit({message});
  }

  private cacheData(res: Response) {
    let todos = res.json();
    console.log('CachData', todos);
    this.stateService.setEtag(res.headers.get('ETag') || '');
    this.stateService.setTodos(todos);
    return todos;
  }

  private queryTodos(todos: any, skip: number, take: number) {
    return todos.slice(skip, take)
      .map(function (todo) {
        todo.created = new Date(todo.created).toDateString();
        todo.revision = todo['_rev'];
        todo.id = todo['_key'];
        return todo;
      })
      .sort(function (a, b) {
        return a.priority - b.priority;
      });
  }

  private handleError(error: any) {
    let errMsg = error.message || error.statusText || 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
