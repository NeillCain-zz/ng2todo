import {Component, OnInit} from '@angular/core';
import {StateService} from '../common/state.service';

@Component({
  selector: 'about',
  template: `
  <h1>{{ title }}</h1>
  <hr>
  <div>
    <h2 class="text-error">Current Etag: {{ currentEtag }}</h2>
    <p>This is used as synching mechanism...</p>
  </div>
  `
})
export class AboutComponent implements OnInit{
  title: string = 'About ma Etag';
  currentEtag: string;

  constructor(public _stateService: StateService) { }

  ngOnInit() {
    this.currentEtag = this._stateService.getEtag();
  }
}
