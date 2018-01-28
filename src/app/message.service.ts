import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {

  constructor() { }

  private messages: string[] = [];

  add (message: string): void {
        this.messages.push(message);
  }

  clear(){
    this.messages.length = 0;
  }

}
