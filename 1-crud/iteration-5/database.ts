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

type MessageInDatabase = Record<string, IMessage>;

type LegacyMessageInDatabase = Record<string, IMessage[]>;

type MessageHistory = Record<string, string[]>;
type CommentHistory = Record<string, string[]>;
type LikeHistory = Record<string, string[]>;

export const messageDatabasePath = "../database/update-messages.json";
export const legacyMessageDatabasePath = "../database/messages.json";
export const messageHistoryDatabasePath = "../database/messages-history.json";
export const commentHistoryDatabasePath = "../database/comment-history.json";
export const likeHistoryDatabasePath = "../database/like-history.json";

export const getLegacyMessages = (): LegacyMessageInDatabase => {
    return JSON.parse(fs.readFileSync(legacyMessageDatabasePath).toString());
}

const getLastLegacyMessageId = (id: string, messages: LegacyMessageInDatabase): number => {
    return messages[id].length - 1;
}

const saveMessages = (messages: MessageInDatabase) => {
    fs.writeFileSync(messageDatabasePath, JSON.stringify(messages, undefined, 4));
}

const addNewStateMessage = (message: IMessage, messages: MessageInDatabase): IMessage => {
    messages[message.id] = message;
    saveMessages(messages);
    return message;
}

const addMessageHistory = (uid: string, content: string) => {
    const messageHistory: MessageHistory = JSON.parse(fs.readFileSync(messageHistoryDatabasePath).toString());
    if (!messageHistory[uid]) messageHistory[uid] = [];
    messageHistory[uid].push(content);
    fs.writeFileSync(messageHistoryDatabasePath, JSON.stringify(messageHistory, undefined, 4));
}

const addCommentHistory = (uid: string, content: string) => {
    const commentHistory: CommentHistory = JSON.parse(fs.readFileSync(commentHistoryDatabasePath).toString());
    if (!commentHistory[uid]) commentHistory[uid] = [];
    commentHistory[uid].push(content);
    fs.writeFileSync(commentHistoryDatabasePath, JSON.stringify(commentHistory, undefined, 4));
}

const addLikeHistory = (uid: string, content: string[]) => {
    const likeHistory: LikeHistory = JSON.parse(fs.readFileSync(likeHistoryDatabasePath).toString());
    if (!likeHistory[uid]) likeHistory[uid] = [];
    likeHistory[uid].push(content.join(","));
    fs.writeFileSync(likeHistoryDatabasePath, JSON.stringify(likeHistory, undefined, 4));
}

export const addMessage = (content: string, author: string): IMessage => {
    const messages = JSON.parse(fs.readFileSync(messageDatabasePath).toString());
    const messageToAdd = {id: v4(), content, author, likes: [], comments: []};
    addMessageHistory(messageToAdd.id, content);
    addLikeHistory(messageToAdd.id, []);
    return addNewStateMessage(messageToAdd, messages);
}

export const getMessages = (): MessageInDatabase => {
    return JSON.parse(fs.readFileSync(messageDatabasePath).toString());
}

export const getMessage = (id: string): IMessage|undefined => {
    const messages = getMessages();
    return messages?.[id];
}

export const editMessage = (id: string, content: string): IMessage => {
    const messages = getMessages();
    const message = messages[id];
    const newMessage = {...message, content};
    addMessageHistory(id, content);
    return addNewStateMessage(newMessage, messages);
}

export const addComment = (id: string, comment: string, author: string): IMessage => {
    const messages = getMessages();
    const message = messages[id];
    const newComment = { content: comment, author, id: v4() };
    const newMessage = {...message, comments: [...message.comments, newComment]};
    addCommentHistory(newComment.id, comment);
    return addNewStateMessage(newMessage, messages);
}

export const editComment = (idMessage: string, editedComment: string, idComment: string): IMessage => {
    const messages = getMessages();
    const message = messages[idMessage];
    const newMessage = {...message, comments: [...message.comments]};
    const comment = newMessage.comments.findLast(comment => comment.id === idComment) as IComment;
    comment.content = editedComment;
    addCommentHistory(idComment, editedComment);
    return addNewStateMessage(newMessage, messages);
}

export const addLike = (id: string, username: string): IMessage => {
    const messages = getMessages();
    const message = messages[id];
    const likes = [...message.likes, {username}]
    const newMessage = {...message, likes};
    addLikeHistory(id, likes.map(like => like.username));
    return addNewStateMessage(newMessage, messages);
}

export const removeLike = (id: string, username: string): IMessage => {
    const messages = getMessages();
    const message = messages[id];
    const likes = message.likes.filter(like => like.username !== username);
    const newMessage = {...message, likes};
    addLikeHistory(id, likes.map(like => like.username));
    return addNewStateMessage(newMessage, messages);
}

export const migrate = () => {
    // Creation des nouvelles "bases de données"
    const messageHistory: MessageHistory = {};
    const commentHistory: CommentHistory = {};
    const likeHistory: LikeHistory = {};
    const updatedMessages: MessageInDatabase = {};

    // Récupération des anciens messages
    const messagesDatabase = getLegacyMessages();
    // On itère sur tous les messages
    for (const uid of Object.keys(messagesDatabase)) {
        let finalMessage: IMessage;
        likeHistory[uid] = [];

        // Iteration sur tous les messages actuellement en base de donnée pour un id donné
        for (const id in messagesDatabase[uid]) {
            const idInt = parseInt(id);
            const message = messagesDatabase[uid][id];
            // On créé la nouvelle entrée pour sauvegarder l'historique d'un même message
            if (!messageHistory[message.id]) messageHistory[message.id] = [];
            // Si on est au premier message ou si le message actuel est différent du message précédent
            if (idInt === 0 || messagesDatabase[uid][idInt - 1].content !== messagesDatabase[uid][id].content)
                // !messageHistory[message.id].includes(message.content))
                messageHistory[message.id].push(message.content);
            // On récupère toutes les personnes qui ont liké ce message
            const peopleLikes = message.likes.map(like => like.username).join(",");
            // Si les utilisateurs qui ont actuellement likes sont différent des derniers likes sauvegardés
            if (likeHistory[uid][likeHistory[uid].length - 1] !== peopleLikes)
                likeHistory[uid].push(peopleLikes);

            // Si le message est le dernier de la liste, on le sauvegarde comme message final
            if (idInt === getLastLegacyMessageId(uid, messagesDatabase)) {
                finalMessage = {
                    ...message,
                    comments: []
                };
                // On itère sur tous les commentaires (et donc l'historique des commentaires)
                for (const comment of message.comments) {
                    // Si le commentaire n'existe pas dans l'historique, on créé l'entrée
                    if (!commentHistory[comment.id])
                        commentHistory[comment.id] = [];
                    // On ajoute le commentaire dans l'historique
                    commentHistory[comment.id].push(comment.content);

                    // On regarde si le commentaire existe déjà dans les commentaires du message final
                    const commentExistInMessage = finalMessage.comments.find(el => el.id === comment.id);
                    // Si le commentaire existe déjà, on met à jour le contenu
                    if (commentExistInMessage) commentExistInMessage.content = comment.content;
                    // Si il n'existe pas, on le rajoute dans les commentaires
                    else finalMessage.comments.push(comment);
                }
                // On sauvegarde le dernier état du message
                updatedMessages[uid] = finalMessage;
            }
        }
    }

    fs.writeFileSync(messageHistoryDatabasePath, JSON.stringify(messageHistory, undefined, 4));
    fs.writeFileSync(commentHistoryDatabasePath, JSON.stringify(commentHistory, undefined, 4));
    fs.writeFileSync(likeHistoryDatabasePath, JSON.stringify(likeHistory, undefined, 4));
    fs.writeFileSync(messageDatabasePath, JSON.stringify(updatedMessages, undefined, 4));
}
