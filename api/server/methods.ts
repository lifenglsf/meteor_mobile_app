import { Chats } from './collections/chats';
import { Messages } from './collections/messages';
import { MessageType } from './models';
import { check, Match } from 'meteor/check';
import { MessageType, Profile } from './models';

const nonEmptyString = Match.Where((str) => {
    check(str, String);
    return str.length > 0;
  });
Meteor.methods({
  addChat(receiverId: string): void {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized',
        'User must be logged-in to create a new chat');
    }
 
    check(receiverId, nonEmptyString);
 
    if (receiverId === this.userId) {
      throw new Meteor.Error('illegal-receiver',
        'Receiver must be different than the current logged in user');
    }
 
    const chatExists = !!Chats.collection.find({
      memberIds: { $all: [this.userId, receiverId] }
    }).count();
 
    if (chatExists) {
      throw new Meteor.Error('chat-exists',
        'Chat already exists');
    }
 
    const chat = {
      memberIds: [this.userId, receiverId]
    };
 
    Chats.insert(chat);
  },
  removeChat(chatId: string): void {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized',
        'User must be logged-in to remove chat');
    }
 
    check(chatId, nonEmptyString);
 
    const chatExists = !!Chats.collection.find(chatId).count();
 
    if (!chatExists) {
      throw new Meteor.Error('chat-not-exists',
        'Chat doesn\'t exist');
    }
 
    Chats.remove(chatId);
  },
  updateProfile(profile: Profile): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to create a new chat');
 
    check(profile, {
      name: nonEmptyString
    });
 
    Meteor.users.update(this.userId, {
      $set: {profile}
    });
  },
  addMessage(type: MessageType, chatId: string, content: string) {
    if (!this.userId) throw new Meteor.Error('unauthorized',
    'User must be logged-in to create a new chat');

    const chatExists = !!Chats.collection.find(chatId).count();
    console.log("------",chatId,"===",content);
    //check(type, Match.OneOf(String, [ MessageType.TEXT ]));
    check(chatId, nonEmptyString);
    check(content, nonEmptyString);
    if (!chatExists) {
      throw new Meteor.Error('chat-not-exists',
        'Chat doesn\'t exist');
    }
 
    return {
      messageId: Messages.collection.insert({
        chatId: chatId,
        senderId: this.userId,
        content: content,
        createdAt: new Date(),
        type: type
      })
    };
  },
  countMessages():number{
    return Messages.colleciton.find().count();
  }
});
