import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { ROUTER_PROVIDERS } from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http';
import { ToastyService, ToastyConfig } from 'ng2-toasty/ng2-toasty';
import { TodoService } from './common/todo.service'
import { StateService } from './common/state.service';
import { AppComponent } from './app.component';

import '../global_styles/testwebpack.css'

if (process.env.ENV === 'production') {
  enableProdMode();
}

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  ToastyService,
  ToastyConfig,
  TodoService,
  StateService
]);
