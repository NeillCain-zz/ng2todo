
import {
  describe,
  expect,
  it
} from '@angular/core/testing';

import { TodoComponent } from './todo.component';

describe('Todo Component', () => {
  it('should be named `HomeComponent`', () => {
    expect(TodoComponent['name']).toBe('TodoComponent');
  });

  it('should have a method called `updateMessage`', () => {
    expect(TodoComponent.prototype.getTodos).toBeDefined();
  });

  it('should have a title Todo List', () => {
    expect(TodoComponent.prototype.title).toBe('Todo List');
  });
});
