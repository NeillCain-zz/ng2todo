import {Component, OnInit} from '@angular/core';
import { Control, FORM_DIRECTIVES, NgClass} from '@angular/common';
import {TodoService} from '../common/todo.service';
import {AlertComponent} from 'ng2-bootstrap/ng2-bootstrap';
import {Todo} from '../common/todo.model'

@Component({
    selector: 'addtodo',
    template: `
  Add another one??????
  <input placeholder="NOTE" #note />
  <input placeholder="PRIORITY" #priority />
  <input placeholder="STATUS" #status />
  <button (click)="addTodo(note.value, priority.value, status.value);">
    Add Todo
  </button>
  <div *ngIf="errorMessage" class="alert alert-danger" role="alert">
    <strong>{{errorMessage}}</strong>
  </div>
  <alert *ngFor="let alert of alerts;let i = index" [type]="alert.type" dismissible="true" (close)="closeAlert(i)">
     {{ alert?.msg }}
  </alert>
  `,
    directives: [AlertComponent]
})

export class AddTodoComponent {
    private skip:Control = new Control();
    private take:Control = new Control();
    constructor(private todoService: TodoService) { }
    public alerts: Array<Object> = [];

    public closeAlert(i: number): void {
        this.alerts.splice(i, 1);
    }

    private addAlert(todo: Todo): void {
        this.alerts.push({ msg: `Added ${todo.note}`, type: 'success', closable: true });
    }
    errorMessage: string;
    showAlert: boolean;
    newTodo: Todo;
    addTodo(note: string, priority: number, status: string) {
        if (!note && !priority && !status) { return; }
        this.todoService.addTodo(note, priority, status)
            .subscribe(
            todo => this.addAlert(todo),
            error => {
                console.log('Error Adding Todo', error)
                this.errorMessage = error
                });
    }
}
