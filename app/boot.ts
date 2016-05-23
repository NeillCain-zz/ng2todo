import {bootstrap} from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import {ROUTER_PROVIDERS} from '@angular/router';
import {HTTP_PROVIDERS} from '@angular/http';

import '../global_styles/testwebpack.css'
import {AppComponent} from './app.component';

if (process.env.ENV === 'production') {
  enableProdMode();
}

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS
]);
