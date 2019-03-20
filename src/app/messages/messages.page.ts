import { Component, OnInit,OnDestroy,ElementRef } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { Chat, Message, MessageType } from 'api/models';
import { Observable } from 'rxjs';
import { Messages } from 'api/collections';
import { MeteorObservable } from 'meteor-rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
@Component({
    selector: 'messages-page',
    template: 'messages.page.html'
})
export class MessagesPage implements OnInit,OnDestroy {
    selectedChat: Chat;
    title: string;
    messages: Observable<Message>;
    message: string = '';
    autoScroller:MutationObserver;
    scrollOffset=0;
    constructor(navParams: NavParams,private el:ElementRef) {
        this.selectedChat = <Chat>navParams.get('chat');
        console.log("Selected chat is:", this.selectedChat);
    }
    ngOnInit() {
        this.autoScroller = this.autoScroll();
        this.subscribeMessages();
        let isEven = false;
        this.messages = Messages.find(
            { chatId: this.selectedChat._id },
            { sort: { createdAt: 1 } }
        ).map((messages: Message) => {
            messages.forEach((message: Message) => {
                message.ownership = isEven ? 'mine' : 'other';
                isEven = !isEven;
            });
        })
        return Messages;
    }
    private get messagesList():Element{
        return this.messagesPageContent.querySelector('.messages');
    }
    private get messagesPageContent():Element{
        return this.el.nativeElement.querySelector('.messages-page-content');
    }
    private get scroller(): Element {
        return this.messagesList.querySelector('.scroll-content');
      }
      ngOnDestroy() {
        this.autoScroller.disconnect();
      }
      subscribeMessages() {
        this.scrollOffset = this.scroller.scrollHeight;
        this.messagesDayGroups = this.findMessagesDayGroups();
      }
     
      findMessagesDayGroups() {
        let isEven = false;
     
        return Messages.find({
          chatId: this.selectedChat._id
        }, {
          sort: { createdAt: 1 }
        })
          .map((messages: Message[]) => {
            const format = 'D MMMM Y';
     
            // Compose missing data that we would like to show in the view
            messages.forEach((message) => {
              message.ownership = isEven ? 'mine' : 'other';
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
          });
      }
      autoScroll(): MutationObserver {
        const autoScroller = new MutationObserver(this.scrollDown.bind(this));
     
        autoScroller.observe(this.messagesList, {
          childList: true,
          subtree: true
        });
     
        return autoScroller;
      }
     
      scrollDown(): void {
        // Scroll down and apply specified offset
        this.scroller.scrollTop = this.scroller.scrollHeight - this.scrollOffset;
        // Zero offset for next invocation
        this.scrollOffset = 0;
      }
     
    onInputKeypress({ keyCode }: KeyboardEvent): void {
        if (keyCode == 13) {
            this.sendTextMessage();
        }
    }
    sendTextMessage(): void {
        if (!this.message) {
            return;
        }

        MeteorObservable.call('addMessage', MessageType.TEXT,
            this.selectedChat._id,
            this.message
        ).zone().subscribe(() => {
            this.message = '';
        })
    }
}
