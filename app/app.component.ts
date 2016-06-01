import {Component} from '@angular/core';
import {Routes, ROUTER_DIRECTIVES} from '@angular/router';
import {AboutComponent} from './about/about.component';
import {TodoComponent} from './todo/todo.component';
import '../images/logo.png'

@Component({
  selector: 'app',
  template: `
<div class="pos-f-t">
  <div class="collapse" id="navbar-header">
    <div class="container bg-inverse p-a-1 color">
      <h3>Collapsed content</h3>
      <p>Toggleable via the navbar brand.</p>
    </div>
  </div>
  <nav class="navbar navbar-light navbar-static-top bg-faded">
    <div class="container">
      <button class="navbar-toggler hidden-sm-up" type="button" data-toggle="collapse" data-target="#exCollapsingNavbar2">
            &#9776;
          </button>
      <div class="collapse navbar-toggleable-xs" id="exCollapsingNavbar2">
        <h1 id="logo">
          <a class="navbar-brand" [routerLink]="['/']"></a>
        </h1>
        <ul class="nav navbar-nav">
        <li class="nav-item">
            <a class="nav-link" [routerLink]="['/todo']">Todo</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" [routerLink]="['/about']">About</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</div>

<div class="container foo">
  <router-outlet></router-outlet>
</div>

<footer>
  <div class="container">
    <span class="text-muted">Place sticky footer content here.</span>
  </div>
</footer>
  `,styles: [`
h1#logo a {
  background: url(../images/logo.png) no-repeat top left;
  width: 194px;
  height: 48px;
  margin: 8px;
  display: block;
  text-indent: -9999px;
}

.nav-item .router-link-active {
  color: #06c;
}
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 40px;
  background-color: #60c;
}

.foo {
  padding-top: 90px;
}
  `],
  directives: [ROUTER_DIRECTIVES]
})
@Routes([
  { path: '/', component: TodoComponent },
  { path: '/about', component: AboutComponent },
  { path: '/todo', component: TodoComponent },
  { path: '/*', component: TodoComponent }
])
export class AppComponent { }
