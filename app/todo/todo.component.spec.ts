
import {
  describe,
  expect,
  it
} from '@angular/core/testing';

import { TodoComponent } from './todo.component';

xdescribe('Todo Component', () => {
  it('should be named `HomeComponent`', () => {
    expect(TodoComponent['name']).toBe('TodoComponent');
  });
});
