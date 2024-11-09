import fs from "fs";

interface IComment {
    content: string
    author: string
}

interface ILike {
    username: string
}

interface IMessage {
    id: number
    content: string
    author: string
    likes: ILike[]
    comments: IComment[]
}

export const messageDatabasePath = "../database/messages.json";

const saveMessages = (messages: IMessage[]) => {
    fs.writeFileSync(messageDatabasePath, JSON.stringify(messages, undefined, 4));
}

export const addMessage = (content: string, author: string): IMessage => {
    const messages = JSON.parse(fs.readFileSync(messageDatabasePath).toString());
    console.log(messages)
    const messageToAdd = {id: messages.length, content, author, likes: [], comments: []};
    messages.push(messageToAdd);
    saveMessages(messages);
    return messageToAdd;
}

export const getMessages = (): IMessage[] => {
    return JSON.parse(fs.readFileSync(messageDatabasePath).toString());
}

export const getMessage = (id: number): IMessage => {
    const messages = getMessages();
    return messages[id];
}

export const editMessage = (id: number, content: string): IMessage => {
    const messages = getMessages();
    messages[id].content = content;
    saveMessages(messages);
    return messages[id];
}

export const addComment = (id: number, comment: string, author: string): IMessage => {
    const messages = getMessages();
    messages[id].comments.push({ content: comment, author });
    saveMessages(messages);
    return messages[id];
}

export const editComment = (idMessage: number, editedComment: string, idComment: number): IMessage => {
    const messages = getMessages();
    messages[idMessage].comments[idComment].content = editedComment;
    saveMessages(messages);
    return messages[idMessage];
}

export const addLike = (id: number, username: string): IMessage => {
    const messages = getMessages();
    messages[id].likes.push({username});
    saveMessages(messages);
    return messages[id];
}

export const removeLike = (id: number, username: string): IMessage => {
    const messages = getMessages();
    messages[id].likes = messages[id].likes.filter(like => like.username !== username);
    saveMessages(messages);
    return messages[id];
}