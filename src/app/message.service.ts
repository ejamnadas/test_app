import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {

  constructor() { }

  private messages: string[] = [];

  get getMessages() { return this.messages; }
  
  add (message: string): void {
        this.clear();
        this.messages.push(message);
  }

  clear(){
    this.messages.length = 0;
  }

}
