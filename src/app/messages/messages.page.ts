import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { Chat, Message, MessageType } from 'api/models';
import { Messages } from 'api/collections';
import { MeteorObservable } from 'meteor-rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import {map} from 'rxjs/operators';
import { NavParams, PopoverController } from 'ionic-angular';
import { MessagesOptionsComponent } from './messages-options';
import { Subscription } from 'rxjs';

@Component({
  selector: 'messages-page',
  templateUrl: 'messages.page.html'
})
export class MessagesPage implements OnInit, OnDestroy {
  selectedChat: Chat;
  title: string;
  picture: string;
  messagesDayGroups;
  message: string = '';
  autoScroller: MutationObserver;
  scrollOffset = 0;
  senderId: string;
  loadingMessages: boolean;
  messagesComputation: Subscription;

  constructor(
    private router: ActivatedRoute,
    private el: ElementRef,
    private popoverCtrl: PopoverController
  ) {
      this.router.queryParams.subscribe(queryParams=>{
      console.log(queryParams);
      this.selectedChat = JSON.parse(queryParams.chat);
    })
    this.title = this.selectedChat.title;
    this.picture = this.selectedChat.picture;
    this.senderId = Meteor.userId();

  }
// Subscribes to the relevant set of messages
subscribeMessages(): void {
  // A flag which indicates if there's a subscription in process
  this.loadingMessages = true;
  // A custom offset to be used to re-adjust the scrolling position once
  // new dataset is fetched
  this.scrollOffset = this.scroller.scrollHeight;

  MeteorObservable.subscribe('messages',
    this.selectedChat._id
  ).subscribe(() => {
    // Keep tracking changes in the dataset and re-render the view
    if (!this.messagesComputation) {
      this.messagesComputation = this.autorunMessages();
    }

    // Allow incoming subscription requests
    this.loadingMessages = false;
  });
}

// Detects changes in the messages dataset and re-renders the view
autorunMessages(): Subscription {
  return MeteorObservable.autorun().subscribe(() => {
    this.messagesDayGroups = this.findMessagesDayGroups();
  });
}
  private get messagesPageContent(): Element {
    return this.el.nativeElement.querySelector('.messages-page-content');
  }

  private get messagesList(): Element {
    return this.messagesPageContent.querySelector('.messages');
  }

  private get scroller(): Element {
    return this.messagesList.querySelector('.scroll-content');
  }

  ngOnInit() {
    this.subscribeMessages();
  }

  ngOnDestroy() {
    this.autoScroller.disconnect();
  }
  showOptions(): void {
    const popover = this.popoverCtrl.create(MessagesOptionsComponent, {
      chat: this.selectedChat
    }, {
      cssClass: 'options-popover messages-options-popover'
    });
 
    popover.present();
  }
  /*subscribeMessages() {
    this.scrollOffset = 0;//this.scroller.scrollHeight;
    this.messagesDayGroups = this.findMessagesDayGroups();
  }*/

  findMessagesDayGroups() {
    let isEven = false;

    return Messages.find({
      chatId: this.selectedChat._id
    }, {
      sort: { createdAt: 1 }
    })
      .pipe(map((messages: Message[]) => {
        const format = 'D MMMM Y';

        // Compose missing data that we would like to show in the view
        messages.forEach((message) => {
          message.ownership = this.senderId == message.senderId ? 'mine' : 'other';

          isEven = !isEven;

          return message;
        });

        // Group by creation day
        const groupedMessages = _.groupBy(messages, (message) => {
          return moment(message.createdAt).format(format);
        });

        // Transform dictionary into an array since Angular's view engine doesn't know how
        // to iterate through it
        return Object.keys(groupedMessages).map((timestamp: string) => {
          return {
            timestamp: timestamp,
            messages: groupedMessages[timestamp],
            today: moment().format(format) === timestamp
          };
        });
      }));
  }

 

 

  onInputKeypress({ keyCode }: KeyboardEvent): void {
    if (keyCode === 13) {
      this.sendTextMessage();
    }
  }

  sendTextMessage(): void {
    // If message was yet to be typed, abort
console.log("sendTextMessage");
    if (!this.message) {
      return;
    }

    MeteorObservable.call('addMessage', MessageType.TEXT,
      this.selectedChat._id,
      this.message
    ).subscribe(() => {
      // Zero the input field
      this.message = '';
    });
  }
}