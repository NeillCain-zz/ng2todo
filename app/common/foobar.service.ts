import {Injectable} from '@angular/core';

@Injectable()
export class FooBarService {

  constructor(){
    console.log('constructing foobar service');
  }

  getFoo():string{
      return 'foo';
  }
}
