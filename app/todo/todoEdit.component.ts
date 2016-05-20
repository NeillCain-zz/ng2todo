import {Component, Output, Input, EventEmitter} from '@angular/core';
import { Control, FORM_DIRECTIVES, NgClass} from '@angular/common';
import {TodoService} from '../common/todo.service';
import {Todo} from '../common/todo.model'

@Component({
    selector: 'todo-edit',
    template: `
    <h2>Edit {{todo.note}}!</h2>
    <input placeholder="NOTE" [(ngModel)]="todo.note" />
    <input placeholder="PRIORITY" [(ngModel)]="todo.priority" />
    <input placeholder="STATUS" [(ngModel)]="todo.status" />
    <label>Id: {{todo.id}}</label>
    <label>Revision: {{todo.revision}}</label>
    <button (click)="edit();">
        Submit
    </button>
    <div *ngIf="errorMessage" class="alert alert-danger" role="alert">
        <strong>{{errorMessage}}</strong>
    </div>
    <hr>
  `,
    providers: [TodoService]
})

export class EditTodoComponent {
    constructor(private todoService: TodoService) { }
    @Input () todo: Todo;
    @Output() doneEvent: EventEmitter<any> = new EventEmitter();
    errorMessage: string;
    showAlert: boolean;
    newTodo: Todo;
    edit() {
        if (!this.todo.note && !this.todo.priority && !this.todo.status) { return; }
        this.todoService.edit(this.todo)
            .subscribe(
            todo => this.doneEvent.emit({foo: 'bar'}),
            error => this.errorMessage = error);
    }
}
