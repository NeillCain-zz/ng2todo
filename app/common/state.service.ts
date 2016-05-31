import {Injectable} from '@angular/core';
import {Todo} from './todo.model'

@Injectable()
export class StateService {
	private etag = '';
  private todos: Todo[] = [];

  constructor(){
    console.log('constructing state service');
  }

  getEtag(): string {
    return this.etag;
  };

  setEtag(etag: string): void {
    this.etag = etag;
  };

  getTodos(): Todo[] {
    return this.todos;
  };

  setTodos(todos: Todo[]): void {
    this.todos = todos;
  };
}
