import {Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import {Todo} from './todo.model';
import { Observable } from 'rxjs/Rx';
import { Headers, RequestOptions } from '@angular/http';

@Injectable()
export class TodoService {
  constructor(private http: Http) { }
  private todoUrl = 'http://todo.kungfoobar.me/todo';
  getTodos(): Observable<Todo[]> {
    let headers = new Headers();
    headers.append('If-None-Match', '715347285830');
    return this.http.get(this.todoUrl, { headers })
      .map(this.extractData)
      .catch(this.handleError);
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

  private extractData(res: Response) {
    return res.json().slice(20, 30)
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
