import fs from "fs";
import { v4 } from "uuid";

interface IComment {
    content: string
    author: string
    id: string
}

interface ILike {
    username: string
}

interface IMessage {
    id: string
    content: string
    author: string
    likes: ILike[]
    comments: IComment[]
}

type MessageInDatabase = Record<string, IMessage[]>;

export const messageDatabasePath = "../database/messages.json";

const saveMessages = (messages: MessageInDatabase) => {
    fs.writeFileSync(messageDatabasePath, JSON.stringify(messages, undefined, 4));
}

const getLastMessageId = (id: string, messages: MessageInDatabase): number => {
    return messages[id].length - 1;
}

const addNewStateMessage = (message: IMessage, messages: MessageInDatabase): IMessage => {
    if (!messages[message.id]) messages[message.id] = [message];
    else messages[message.id].push(message);
    saveMessages(messages);
    return message;
}

export const addMessage = (content: string, author: string): IMessage => {
    const messages = JSON.parse(fs.readFileSync(messageDatabasePath).toString());
    const messageToAdd = {id: v4(), content, author, likes: [], comments: []};
    return addNewStateMessage(messageToAdd, messages);
}

export const getMessages = (): MessageInDatabase => {
    return JSON.parse(fs.readFileSync(messageDatabasePath).toString());
}

export const getMessage = (id: string): IMessage|undefined => {
    const messages = getMessages();
    return messages?.[id]?.[getLastMessageId(id, messages)];
}

export const editMessage = (id: string, content: string): IMessage => {
    const messages = getMessages();
    const message = messages[id][getLastMessageId(id, messages)];
    const newMessage = {...message, content};
    return addNewStateMessage(newMessage, messages);
}

export const addComment = (id: string, comment: string, author: string): IMessage => {
    const messages = getMessages();
    const message = messages[id][getLastMessageId(id, messages)];
    const newMessage = {...message, comments: [...message.comments, { content: comment, author, id: v4() }]};
    return addNewStateMessage(newMessage, messages);
}

export const editComment = (idMessage: string, editedComment: string, idComment: string): IMessage => {
    const messages = getMessages();
    const message = messages[idMessage][getLastMessageId(idMessage, messages)];
    const newMessage = {...message, comments: [...message.comments]};
    const comment = newMessage.comments.findLast(comment => comment.id === idComment);
    newMessage.comments.push({...comment as IComment, content: editedComment});
    return addNewStateMessage(newMessage, messages);
}

export const addLike = (id: string, username: string): IMessage => {
    const messages = getMessages();
    const message = messages[id][getLastMessageId(id, messages)];
    const newMessage = {...message, likes: [...message.likes, {username}]};
    return addNewStateMessage(newMessage, messages);
}

export const removeLike = (id: string, username: string): IMessage => {
    const messages = getMessages();
    const message = messages[id][getLastMessageId(id, messages)];
    const newMessage = {...message, likes: message.likes.filter(like => like.username !== username)};
    return addNewStateMessage(newMessage, messages);
}

export const migrate = () => {
    // Nothing to do here. Lucky !
}