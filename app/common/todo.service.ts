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
  private _todoReplay: ReplaySubject<Todo[]> = new ReplaySubject<Todo[]>();
  private _todos: Todo[]
  private socket: SocketIOClient.Socket;
  @Output() cacheUpdatedEvent: EventEmitter<ToastyMessage> = new EventEmitter<ToastyMessage>();

  constructor(private http: Http, private stateService: StateService) {
    this.socket = sio.connect('ws://todo.kungfoobar.me');

    this.socket.on('connect', data => {
      this.notify('Connected to cache invalidation notifier');
    });

    this.socket.on('post', data => {
      this.reloadStuffd('New Todo Created, refreshed cache');
    });

    this.socket.on('put', data => {
      this.reloadStuffd('Todo Updated, refreshed cache');
    });
  }
  /////// UNIT TEST LOL

  public testtodos() {
    var mockNewTodos = [{
      "note": "NEWTODO1",
      "id": "730558060358",
      "_id": "todoData/730558060358",
      "_rev": "762465113926",
      "_key": "730558060358"
    }, {
        "note": "UPDATEDTODO1",
        "id": "730558256966",
        "_id": "todoData/730558256966",
        "_rev": "780116776774",
        "_key": "730558256966"
      }, {
        "note": "UPDATEDTODO2",
        "_id": "todoData/781208672070",
        "id": "781208672070",
        "_rev": "781208672070",
        "_key": "781208672070"
      }, {
        "note": "NEWTODO2",
        "id": "7310736979000",
        "_id": "todoData/7310736979000",
        "_rev": "781573117766",
        "_key": "731073697606"
      }]

    var mockCurrentlyCachedtodos =
      [{
        "note": "WONT BE UPDATE OR REMOVED ON MERGED - FIRST",
        "_id": "todoData/832874108742",
        "_rev": "832874108742",
        "_key": "832874108742"
      },
        {
          "note": "CURRENTTODO1",
          "id": "730558256966",
          "_id": "todoData/730558256966",
          "_rev": "780116776774",
          "_key": "730558256966"
        },
        {
          "note": "WONT BE UPDATE OR REMOVED ON MERGED - MIDDLE",
          "_id": "todoData/832896718662",
          "_rev": "832896718662",
          "_key": "832896718662"
        },
        {
          "note": "CURRENTTODO2",
          "_id": "todoData/781208672070",
          "id": "781208672070",
          "_rev": "781208672070",
          "_key": "781208672070"
        },
        {
          "note": "WONT BE UPDATE OR REMOVED ON MERGED - LAST",
          "_id": "todoData/832899536710",
          "_rev": "832899536710",
          "_key": "832899536710"
        }]

    console.log('new todos', this.getNewTodos(mockCurrentlyCachedtodos, mockNewTodos));
    console.log('mergedUpdates', this.mergeUpdates(mockCurrentlyCachedtodos, mockNewTodos));
  }

  /////// UNIT TEST LOL

  private getNewTodos(currentTodos, incomingTodos) {
    return incomingTodos.reduce(function (accumulator, newTodo, meh, peh) {
      let existingTodo = currentTodos.find(currentTodo => newTodo['_key'] === currentTodo['_key']);
      if (existingTodo) {
        return accumulator || []
      };
      if (accumulator) {
        return accumulator.concat(newTodo);
      }
      return [].concat(newTodo);
    }, []);
  }

  private mergeUpdates(currentTodos, incomingTodos) {
    let mergedTodos = [].concat(currentTodos);
    incomingTodos.map(incTodo => {
      console.log('mergeUpdates incomingTodo', incTodo);
      let i = mergedTodos.findIndex(cur => incTodo['_key'] === cur['_key']);
      console.log('mergeUpdates i', i);
      if (i >= 0) {
        mergedTodos = [
          ...mergedTodos.slice(0, i),
          incTodo,
          ...mergedTodos.slice(i + 1)
        ];
      }
    });

    return mergedTodos;
  }

  private reloadStuffd(message) {
    console.log('reloading');
    let headers = new Headers();
    headers.append('If-None-Match', this.stateService.getEtag() || '');
    headers.append('Access-Control-Expose-Headers', 'etag');
    return this.http.get(this.todoUrl, { headers })
      .subscribe(
      res => {
        this.stateService.setEtag(res.headers.get('ETag'));
        let currentTodos = this.stateService.getTodos();
        let incomingTodos = this.cacheData(res.json())
        let mergedTodos = this.mergeUpdates(currentTodos, incomingTodos).concat(this.getNewTodos(currentTodos, incomingTodos))
        this.cacheData(mergedTodos)
        this.notify(message);
      },
      error => {
        console.log('ERROR refreshing todos', error)
        this._todoReplay.error(error)
      });
  }

  getTodos(skip: number, take: number): Observable<Todo[]> {
    let todos = this.stateService.getTodos();
    console.log('get todos', { skip, take, todos });

    this._todoReplay = this._todoReplay.isUnsubscribed ? new ReplaySubject<Todo[]>(1) : this._todoReplay;
    if (todos.length > 0) {
      todos = this.queryTodos(todos, skip, take)
      this._todoReplay.next(todos);
    }
    else {
      let headers = new Headers();
      headers.append('Access-Control-Expose-Headers', 'etag');
      this.http.get(this.todoUrl, {headers})
        .subscribe(
        res => {
          var eTag = res.headers.get('ETag');
          console.log('etag', eTag);
          this.stateService.setEtag(eTag);
          let todos = this.cacheData(res.json());
          todos = this.queryTodos(todos, skip, take)
          this._todoReplay.next(todos);
        },
        error => {
          console.log('ERROR retrieving todos', error)
          this._todoReplay.error(error)
        });
    }
    return this._todoReplay;
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
    headers.append('Access-Control-Expose-Headers', 'etag');
    let options = new RequestOptions({ headers: headers });
    return this.http.put(this.todoUrl + `/${todo.id}`, body, options)
      .map(() => todo)
      .catch(this.handleError);
  }

  private notify(message: string) {
    this.cacheUpdatedEvent.emit({ message });
  }

  private cacheData(todos: Todo[]) {
    console.log('caching', todos);
    this.stateService.setTodos(todos);
    return todos;
  }

  private queryTodos(todos: Todo[], skip: number, take: number) {
    var todos =
      todos.sort(function (a, b) {
        return a.priority - b.priority;
      })
        .slice(skip, take)
        .map(function (todo) {
          todo.created = new Date(todo.created).toDateString();
          todo.revision = todo['_rev'];
          todo.id = todo['_key'];
          return todo;
        })
    return todos;
  }

  private handleError(error: any) {
    let errMsg = error.message || error.statusText || 'Server error';
    console.error(error);
    return Observable.throw(errMsg);
  }
}
