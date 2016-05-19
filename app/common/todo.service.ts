import {Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import {Todo} from './todo.model';
import { Observable } from 'rxjs/Rx';
import { Headers, RequestOptions } from '@angular/http';

@Injectable()
export class TodoService {
  constructor (private http: Http) {}
  private todoUrl = 'http://todo.kungfoobar.me/todo';
  getTodos (): Observable<Todo[]> {
    return this.http.get(this.todoUrl)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  addTodo (note: string, priority: number, status: string) : Observable<Todo> {
    let body = JSON.stringify({ note, priority, status });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.todoUrl, body, options)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  private extractData(res: Response) {
    return res.json();
  }
  private handleError (error: any) {
    let errMsg = error.message || error.statusText || 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
