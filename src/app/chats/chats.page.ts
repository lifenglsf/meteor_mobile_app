import { Component, OnInit } from '@angular/core';
import { Chats, Messages } from 'api/collections';
import { Chat,MessageType } from '../../models';
import { Observable,of, interval } from 'rxjs';
import * as moment from 'moment';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { debounce, map } from 'rxjs/operators';
@Component({
  templateUrl: 'chats.page.html'
})
export class ChatsPage implements OnInit{
  chats;
  ngOnInit(): void {
    this.chats = this.findChats();
    //throw new Error("Method not implemented.");
  }

  constructor(private router:Router) {
    
  }
  private findChats(): Observable<Chat[]> {
    console.log(Chats.find().cursor.count());
    //Chats.find({}).pipe(debounce(()=>interval(50))).subscribe(todoCount=>console.log(todoCount));
    return of([
      {
        _id: 'zmoHzNS7jcgYuSszg',
        title: 'Ethan Gonzalez',
        picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
        lastMessage: {
          content: 'You on your way?',
          createdAt: moment().subtract(1, 'hours').toDate()
        }
      },
      {
        _id: 'jNkGvF3w54bKuY7Fk',
        title: 'Bryan Wallace',
        picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg',
        lastMessage: {
          content: 'Hey, it\'s me',
          createdAt: moment().subtract(2, 'hours').toDate()
        }
      },
      {
        _id: 'BnPThyTxHtESGaiJs',
        title: 'Avery Stewart',
        picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg',
        lastMessage: {
          content: 'I should buy a boat',
          createdAt: moment().subtract(1, 'days').toDate()
        }
      },
      {
        _id: 'xQtbqQq3GrnWY6kog',
        title: 'Katie Peterson',
        picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg',
        lastMessage: {
          content: 'Look at my mukluks!',
          createdAt: moment().subtract(4, 'days').toDate()
        }
      },
      {
        _id: 'P9c8FmRitMyMqqJeF',
        title: 'Ray Edwards',
        picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg',
        lastMessage: {
          content: 'This is wicked good ice cream.',
          createdAt: moment().subtract(2, 'weeks').toDate()
        }
      }
    ]);
  /*ngOnInit() {
    Chats
    .find({}).subscribe(()=>{});
    this.chats = Chats.find({});
    console.log(this.chats.cursor.count());
    /*.mergeMap((chats: Chat[]) =>
      ops.combineLatest(
        ...chats.map((chat: Chat) =>
          Messages
            .find({chatId: chat._id})
            .pipe(ops.startWith(null))
            .pipe(ops.map(messages => {
              if (messages) chat.lastMessage = messages[0];
              return chat;
            })
            )
        )
      )
    ));
    //.zone();
}*/

 
    /*this.chats = this.chats.pipe(ops.map((chatsArray: Chat[]) => {
      const chatIndex = chatsArray.indexOf(chat);
      if (chatIndex !== -1) {
        chatsArray.splice(chatIndex, 1);
      }

      return chatsArray;
    }));*/
  }
  showMessages(chat):void{
   console.log('showMessage');
   console.log(chat);
   this.router.navigate(['/tabs/messages'],{queryParams:{chat:JSON.stringify(chat)}});
  }
  removeChat(chat: Chat): void {
   console.log('removechat');
   console.log(chat._id);
  const r = Chats.remove({_id:chat._id}).subscribe(()=>{});
   console.log(r);
  }
}