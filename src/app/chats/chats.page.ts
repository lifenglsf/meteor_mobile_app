import { Component, OnInit } from '@angular/core';
import { Chats, Messages } from 'api/collections';
import { Chat } from 'api/models';
import { Router } from '@angular/router';
@Component({
  templateUrl: 'chats.page.html'
})
export class ChatsPage implements OnInit {
  chats;

  constructor(private router:Router) {
  }

  ngOnInit() {
    this.chats = Chats
      .findOne({});
      console.log(this.chats);
  }

  showMessages(chat):void{
    this.router.navigate(['messagespage']);
  }
  removeChat(chat: Chat): void {
    this.chats = this.chats.map((chatsArray: Chat[]) => {
      const chatIndex = chatsArray.indexOf(chat);
      if (chatIndex !== -1) {
        chatsArray.splice(chatIndex, 1);
      }

      return chatsArray;
    });
  }
}