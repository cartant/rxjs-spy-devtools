import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { Message } from './types';

@Injectable()
export class ChromeMockService {

  public messages: Observable<Message> = empty<Message>();

  constructor() {}
}
