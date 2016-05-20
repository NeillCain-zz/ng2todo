import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Todo } from './todo.model';
import { Observable } from 'rxjs/Rx';
import { Headers, RequestOptions } from '@angular/http';
import { StateService } from './state.service'

@Injectable()
export class TodoService {
  constructor(private http: Http, private stateService: StateService) { }
  private todoUrl = 'http://todo.kungfoobar.me/todo';

  getTodos(skip: number, take: number): Observable<Todo[]> {
    let todos = this.stateService.getTodos();
    if(todos.length > 0){
      console.log('todo from cache', todos);
      return Observable.from(this.queryTodos(todos, skip, take), (x) => x).toArray();
    }
    let headers = new Headers();
    headers.append('If-None-Match', this.stateService.getEtag());
    return this.http.get(this.todoUrl, { headers })
      .map(res=>this.cacheData(res))
      .map(todos=>this.queryTodos(todos, skip, take))
      .catch(err=>this.handleError(err));
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

  private cacheData(res: Response) {
    let todos = res.json();
    this.stateService.setEtag(res.headers.get('ETag') || '');
    this.stateService.setTodos(todos);
    console.log('cacheData', todos);
    return todos;
  }

  private queryTodos(todos: any, skip: number, take: number){
    return todos.slice(skip, take)
      .map(function (todo) {
        todo.created = new Date(todo.created).toDateString();
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
