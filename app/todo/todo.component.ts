import {Component, OnInit} from '@angular/core';
import {TodoService} from '../common/todo.service';
import {AlertComponent} from 'ng2-bootstrap/ng2-bootstrap';
import {Todo} from '../common/todo.model'

@Component({
  selector: 'todo',
  template: `
  <div class="page-header m-t-1">
    <h1>Ma Todo Synch</h1>
  </div>
  <hr>
  <ul class="list-group">
    <li *ngFor="let todo of todos" class="list-group-item">
      <span class="label label-default label-pill pull-xs-right">{{todo.priority}}</span>
      {{todo.created}}
    </li>
  </ul>
  New Todo:
  <input placeholder="NOTE" #note />
  <input placeholder="PRIORITY" #priority />
  <input placeholder="STATUS" #status />
  <button (click)="addTodo(note.value, priority.value, status.value);">
    Add Todo
  </button>
  <div class="error" *ngIf="errorMessage">{{errorMessage}}</div>`,
  directives: [AlertComponent],
  providers: [TodoService]
})

export class TodoComponent implements OnInit {
  constructor (private todoService: TodoService) {}
  errorMessage: string;
  todos:Todo[];
  ngOnInit() { this.getTodos(); }
  getTodos() {
    this.todoService.getTodos()
                     .subscribe(
                       todos => this.todos = todos,
                       error =>  this.errorMessage = error);
  }
  addTodo (note: string, priority: number, status: string) {
    if (!note && !priority && !status) { return; }
    this.todoService.addTodo(note, priority, status)
                     .subscribe(
                       hero  => this.todos.push(hero),
                       error =>  this.errorMessage = error);
  }
}

