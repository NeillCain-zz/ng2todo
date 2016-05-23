import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Todo } from './todo.model';
import { ReplaySubject, Observable } from "rxjs/Rx";
import { Headers, RequestOptions } from '@angular/http';
import { StateService } from './state.service'

@Injectable()
export class TodoService {
  private todoUrl = 'http://todo.kungfoobar.me/todo';
  private _todos: ReplaySubject<Todo[]> = new ReplaySubject<Todo[]>();
  
  constructor(private http: Http, private stateService: StateService) { }
    
  getTodos(skip: number, take: number): Observable<Todo[]> {
    this._todos = this._todos.isUnsubscribed ? new ReplaySubject<Todo[]>() : this._todos;
    let todos = this.stateService.getTodos();
    if(todos.length > 0){
      todos = this.queryTodos(todos, skip, take)      
      this._todos.next(todos);            
    }
    else{
      let headers = new Headers();
      headers.append('If-None-Match', this.stateService.getEtag());
      if (!this._todos.observers.length) {
            this.http.get(this.todoUrl)
              .subscribe(
                res => {
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

  edit(todo: Todo){
    let body = JSON.stringify(todo);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('If-Match', todo.revision);
    let options = new RequestOptions({ headers: headers });
    return this.http.put(this.todoUrl + `/${todo.id}`, body, options)
      .map(() => todo)
      .catch(this.handleError);
  }

  private cacheData(res: Response) {
    let todos = res.json();
    this.stateService.setEtag(res.headers.get('ETag') || '');
    this.stateService.setTodos(todos);    
    return todos;
  }

  private queryTodos(todos: any, skip: number, take: number){
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
