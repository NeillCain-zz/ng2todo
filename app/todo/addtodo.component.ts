import {Component, OnInit} from '@angular/core';
import {Control, FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators} from '@angular/common';
import {TodoService} from '../common/todo.service';
import {AlertComponent} from 'ng2-bootstrap/ng2-bootstrap';
import {Todo} from '../common/todo.model'

@Component({
    selector: 'addtodo',
    styles: [`
        div {
            background-color: #06c;
        }
    `],
    template: `
    <div>
        <h4>Add another one??????</h4>
        <form [ngFormModel]="addForm">
            <div class="row">
                <div class="form-group col-sm-4" [ngClass]="{ 'has-danger' : !note.valid }">
                    <label class="form-control-label" for="note">Note</label>
                    <input #note placeholder="NOTE" type="text" class="form-control" [ngClass]="{ 'form-control-danger' : !note.valid }">
                </div>
                <div class="form-group col-sm-4" [ngClass]="{ 'has-danger' : !priority.valid }">
                    <label class="form-control-label" for="priority">Priority</label>
                    <input #priority placeholder="PRIORITY" type="text" class="form-control" [ngClass]="{ 'form-control-danger' : !priority.valid }">
                </div>
                <div class="form-group col-sm-4" [ngClass]="{ 'has-danger' : !status.valid }">
                    <label class="form-control-label" for="status">Status</label>
                    <input #status placeholder="STATUS" type="text" class="form-control" [ngClass]="{ 'form-control-danger' : !status.valid }">
                </div>
            </div>
            <div class="row">
            <button (click)="addTodo(note.value, priority.value, status.value);" class="btn btn-success-outline">
                Add Todo
            </button>
            <div *ngIf="errorMessage" class="alert alert-danger" role="alert">
                <strong>{{errorMessage}}</strong>
            </div>
            <alert *ngFor="let alert of alerts;let i = index" [type]="alert.type" dismissible="true" (close)="closeAlert(i)">
                {{ alert?.msg }}
            </alert>
            </div>
        </form>
    </div>
  `,
    directives: [FORM_DIRECTIVES, AlertComponent]
})

export class AddTodoComponent {
    private addForm: ControlGroup;
    constructor(private todoService: TodoService, private builder: FormBuilder) {
        this.addForm = builder.group({});
    }
    private alerts: Array<Object> = [];

    private closeAlert(i: number): void {
        this.alerts.splice(i, 1);
    }

    private addAlert(todo: Todo): void {
        this.alerts.push({ msg: `Added ${todo.note}`, type: 'success', closable: true });
    }
    private errorMessage: string;
    private showAlert: boolean;
    private newTodo: Todo;

    private addTodo(note: string, priority: number, status: string) {
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
