export const DEFAULT_PICTURE_URL = '/assets/default-profile-pic.svg';
 
export interface Profile {
  name?: string;
  picture?: string;
}
export enum MessageType {
    TEXT = <any>'text'
  }
   
  export interface Chat {
    _id?: string;
    title?: string;
    picture?: string;
    lastMessage?: Message;
    memberIds?: string[];

  }
   
  export interface Message {
    _id?: string;
    chatId?: string;
    content?: string;
    createdAt?: Date;
    type?: MessageType
    ownership?: string;
    senderId?: string;

  }
  export interface User extends Meteor.User {
    profile?: Profile;
  }