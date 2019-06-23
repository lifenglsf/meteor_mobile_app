import { Meteor } from 'meteor/meteor';
import { Chats } from './collections/chats';
import { Messages } from './collections/messages';
import * as moment from 'moment';
import { MessageType } from './models';
import { Accounts } from 'meteor/accounts-base';
import { Users } from './collections/users';

Meteor.startup(() => {
  if (Meteor.settings) {
    Object.assign(Accounts._options, Meteor.settings['accounts-phone']);
    SMS.twilio = Meteor.settings['twilio'];
  }
  if (Users.collection.find().count() > 0) {
    return;
  }
  if (Chats.find({}).cursor.count() === 0) {
    let chatId;
    chatId = Chats.collection.insert({
      title: 'Ethan Gonzalez',
    });
 
    Messages.collection.insert({
      chatId: chatId,
      content: 'You on your way?',
      createdAt: moment().subtract(1, 'hours').toDate(),
      type: MessageType.TEXT
    });
 
    chatId = Chats.collection.insert({
      title: 'Bryan Wallace',
    });
 
    Messages.collection.insert({
      chatId: chatId,
      content: 'Hey, it\'s me',
      createdAt: moment().subtract(2, 'hours').toDate(),
      type: MessageType.TEXT
    });
 
    chatId = Chats.collection.insert({
      title: 'Avery Stewart',
    });
 
    Messages.collection.insert({
      chatId: chatId,
      content: 'I should buy a boat',
      createdAt: moment().subtract(1, 'days').toDate(),
      type: MessageType.TEXT
    });
 
    chatId = Chats.collection.insert({
      title: 'Katie Peterson',
    });
 
    Messages.collection.insert({
      chatId: chatId,
      content: 'Look at my mukluks!',
      createdAt: moment().subtract(4, 'days').toDate(),
      type: MessageType.TEXT
    });
 
    chatId = Chats.collection.insert({
      title: 'Ray Edwards',
    });
 
    Messages.collection.insert({
      chatId: chatId,
      content: 'This is wicked good ice cream.',
      createdAt: moment().subtract(2, 'weeks').toDate(),
      type: MessageType.TEXT
    });
  }
  Accounts.createUserWithPhone({
    phone: '+972540000001',
    profile: {
      name: 'Ethan Gonzalez',
      picture: 'https://randomuser.me/api/portraits/men/1.jpg'
    }
  });
 
  Accounts.createUserWithPhone({
    phone: '+972540000002',
    profile: {
      name: 'Bryan Wallace',
      picture: 'https://randomuser.me/api/portraits/lego/1.jpg'
    }
  });
 
  Accounts.createUserWithPhone({
    phone: '+972540000003',
    profile: {
      name: 'Avery Stewart',
      picture: 'https://randomuser.me/api/portraits/women/1.jpg'
    }
  });
 
  Accounts.createUserWithPhone({
    phone: '+972540000004',
    profile: {
      name: 'Katie Peterson',
      picture: 'https://randomuser.me/api/portraits/women/2.jpg'
    }
  });
 
  Accounts.createUserWithPhone({
    phone: '+972540000005',
    profile: {
      name: 'Ray Edwards',
      picture: 'https://randomuser.me/api/portraits/men/2.jpg'
    }
  });
});
