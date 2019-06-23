import { Component, OnInit } from '@angular/core';
import { Chats, Messages } from 'api/collections';
import { Chat,MessageType } from '../../models';
import { Observable,of, interval } from 'rxjs';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { mergeMap,combineLatest,startWith } from 'rxjs/operators';
import { NavController, PopoverController } from '@ionic/angular';
import { ChatsOptionsComponent } from './chats-options';
import { NavController, PopoverController, ModalController } from 'ionic-angular';
import { NewChatComponent } from './new-chat';
import { Chats, Messages, Users } from 'api/collections';
import { Chat, Message } from 'api/models';
import { MeteorObservable } from 'meteor-rxjs';
import { NavController, PopoverController, ModalController, AlertController } from 'ionic-angular';

@Component({
  templateUrl: 'chats.page.html'
})
export class ChatsPage implements OnInit{
  chats;
  senderId: string;

  ngOnInit(): void {
    MeteorObservable.subscribe('chats').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.chats = this.findChats();
      });
    });

    //throw new Error("Method not implemented.");
  }
 // constructor(private router:Router,private popoverCtrl:PopoverController,
   // private modalCtrl: ModalController) {
  //})
  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController) {
      this.senderId = Meteor.userId();

  }
  findChats(): Observable<Chat[]> {
    // Find chats and transform them
    return Chats.find().map(chats => {
      chats.forEach(chat => {
        chat.title = '';
        chat.picture = '';
 
        const receiverId = chat.memberIds.find(memberId => memberId !== this.senderId);
        const receiver = Users.findOne(receiverId);
 
        if (receiver) {
          chat.title = receiver.profile.name;
          chat.picture = receiver.profile.picture;
        }
 
        // This will make the last message reactive
        this.findLastChatMessage(chat._id).subscribe((message) => {
          chat.lastMessage = message;
        });
      });
 
      return chats;
    });
  }
 
  findLastChatMessage(chatId: string): Observable<Message> {
    return Observable.create((observer: Subscriber<Message>) => {
      const chatExists = () => !!Chats.findOne(chatId);
 
      // Re-compute until chat is removed
      MeteorObservable.autorun().takeWhile(chatExists).subscribe(() => {
        Messages.find({ chatId }, {
          sort: { createdAt: -1 }
        }).subscribe({
          next: (messages) => {
            // Invoke subscription with the last message found
            if (!messages.length) {
              return;
            }
 
            const lastMessage = messages[0];
            observer.next(lastMessage);
          },
          error: (e) => {
            observer.error(e);
          },
          complete: () => {
            observer.complete();
          }
        });
      });
    });
  }
 
  addChat(): void {
    const modal = this.modalCtrl.create(NewChatComponent);
    modal.present();
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
  /*removeChat(chat: Chat): void {
   console.log('removechat');
   console.log(chat._id);
  const r = Chats.remove({_id:chat._id}).subscribe(()=>{});
   console.log(r);
  }*/


  removeChat(chat: Chat): void {
    MeteorObservable.call('removeChat', chat._id).subscribe({
      error: (e: Error) => {
        if (e) {
          this.handleError(e);
        }
      }
    });
  }
 
  handleError(e: Error): void {
    console.error(e);
 
    const alert = this.alertCtrl.create({
      buttons: ['OK'],
      message: e.message,
      title: 'Oops!'
    });
 
    alert.present();
  }
  showOptions(): void {
    const popover = this.popoverCtrl.create(ChatsOptionsComponent, {}, {
      cssClass: 'options-popover chats-options-popover'
    });
 
    popover.present();
  }
}