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

interface IEvent {
    type: string
    data: any
    streamName: string;
}

abstract class AbstractEvent implements IEvent {
    type: string;
    data: Record<string, any>;
    abstract streamName: string;

    constructor (type: string, data: Record<string, any> = {}) {
        this.type = type
        this.data = data
    }
}

class MessageAdded extends AbstractEvent {
    streamName: string;

    constructor(data: Pick<IMessage, "author" | "content" | "id">) {
        super(MessageAdded.name, data);
        this.streamName = `message-${data.id}`;
    }
}

class MessageEdited extends AbstractEvent {
    streamName: string;

    constructor(data: Pick<IMessage, "content"|"id">) {
        super(MessageEdited.name, data);
        this.streamName = `message-${data.id}`;
    }
}

class CommentAdded extends AbstractEvent {
    streamName: string;

    constructor(data: IComment & {messageId: IMessage["id"]}) {
        super(CommentAdded.name, data);
        this.streamName = `message-${data.messageId}`;
    }
}

class CommentEdited extends AbstractEvent {
    streamName: string;

    constructor(data: Pick<IComment, "content" | "id"> & {messageId: IMessage["id"]}) {
        super(CommentEdited.name, data);
        this.streamName = `message-${data.messageId}`;
    }
}

class LikeAdded extends AbstractEvent {
    streamName: string;

    constructor(data: ILike & {id: IMessage["id"]}) {
        super(LikeAdded.name, data);
        this.streamName = `message-${data.id}`
    }
}

class LikeRemoved extends AbstractEvent {
    streamName: string;

    constructor(data: ILike & {id: IMessage["id"]}) {
        super(LikeRemoved.name, data);
        this.streamName = `message-${data.id}`;
    }
}

export const messageDatabasePath = "../database/messages.json";
export const eventDatabasePath = "../database/events.json";

class MessageEventsHandler {
    handleEvent(event: AbstractEvent) {
        const onEventType = `on${event.type}`;
        if (typeof (this as Record<string, any>)[onEventType] === "function") (this as Record<string, any>)[onEventType](event);
    }

    private onMessageAdded(event: MessageAdded) {
        const messages = getMessages();
        messages[event.data.id] = {
            id: event.data.id,
            author: event.data.author,
            content: event.data.content,
            comments: [],
            likes: []
        };
        saveMessages(messages);
    }

    private onMessageEdited(event: MessageEdited) {
        const messages = getMessages();
        messages[event.data.id].content = event.data.content;
        saveMessages(messages);
    }

    private onCommentAdded(event: CommentAdded) {
        const messages = getMessages();
        messages[event.data.messageId].comments.push({
            id: event.data.id,
            author: event.data.author,
            content: event.data.content
        });
        saveMessages(messages);
    }

    private onCommentEdited(event: CommentEdited) {
        const messages = getMessages();
        const comment = messages[event.data.messageId]
            .comments
            .find(comment => comment.id === event.data.id) as IComment;
        comment.content = event.data.content;
        saveMessages(messages);
    }

    private onLikeAdded(event: LikeAdded) {
        const messages = getMessages();
        messages[event.data.id].likes.push({username: event.data.username});
        saveMessages(messages);
    }

    private onLikeRemoved(event: LikeRemoved) {
        const messages = getMessages();
        messages[event.data.id].likes = messages[event.data.id]
            .likes
            .filter(like => like.username !== event.data.username);
        saveMessages(messages);
    }
}

class EventRepository {
    saveEvent(event: AbstractEvent) {
        const events = this.getEvents();
        if (!events[event.streamName]) events[event.streamName] = [];
        events[event.streamName].push(event);
        fs.writeFileSync(eventDatabasePath, JSON.stringify(events, undefined, 4));
    }

    getEvents(): Record<string, AbstractEvent[]> {
        return JSON.parse(fs.readFileSync(eventDatabasePath).toString());
    }

    getStream(streamName: string) {
        const events = this.getEvents();
        return events[streamName] || [];
    }
}

class EventBus {
    private _eventRepository: EventRepository;

    constructor() {
        this._eventRepository = new EventRepository();
    }

    async publish(event: AbstractEvent) {
        this._eventRepository.saveEvent(event);
        const messageEventsHandler = new MessageEventsHandler();
        messageEventsHandler.handleEvent(event);
    }
}

export class MessageAggregate {
    private _eventRepository: EventRepository;

    private _streamName: string;
    private _exist: boolean = false;
    private _content?: string;
    private _author?: string;
    private _commentsId: string[] = [];
    private _userLikes: string[] = [];

    constructor(id: string) {
        this._streamName = `message-${id}`;
        this._eventRepository = new EventRepository();
    }

    public loadFromHistory() {
        const events = this._eventRepository.getStream(this._streamName);
        for (const event of events) {
            const onEventType = `on${event.type}`;
            if (typeof (this as Record<string, any>)[onEventType] === "function") (this as Record<string, any>)[onEventType](event);
        }
    }

    private onMessageAdded(event: MessageAdded) {
        this._exist = true;
        this._content = event.data.content;
        this._author = event.data.author;
    }

    private onMessageEdited(event: MessageEdited) {
        this._content = event.data.content;
    }

    private onCommentAdded(event: CommentAdded) {
        this._commentsId.push(event.data.id);
    }

    private onCommentEdited() {

    }

    private onLikeAdded(event: LikeAdded) {
        this._userLikes.push(event.data.username);
    }

    private onLikeRemoved(event: LikeRemoved) {
        this._userLikes = this._userLikes.filter(userLike => userLike !== event.data.username);
    }



    commentExist(commentId: string): boolean {
        return this._commentsId.includes(commentId);
    }

    userHasLiked(username: string): boolean {
        return this._userLikes.includes(username);
    }

    get exist() : boolean {
        return this._exist;
    }
}

const saveMessages = (messages: Record<string, IMessage>) => {
    fs.writeFileSync(messageDatabasePath, JSON.stringify(messages, undefined, 4));
}

export const getMessages = (): Record<string, IMessage> => {
    return JSON.parse(fs.readFileSync(messageDatabasePath).toString());
}

export const getMessage = (id: string) => {
    const messages = getMessages();
    return messages[id];
}

export const addMessage = (content: string, author: string) => {
    const event = new MessageAdded({
        author,
        content,
        id: v4()
    });
    new EventBus().publish(event);
}

export const editMessage = (id: string, content: string) => {
    const aggregate = new MessageAggregate(id);
    aggregate.loadFromHistory();
    if (!aggregate.exist) throw new Error(`Message ${id} does not exist`);
    const event = new MessageEdited({
        id,
        content
    });
    new EventBus().publish(event);
}

export const addComment = (id: string, comment: string, author: string) => {
    const aggregate = new MessageAggregate(id);
    aggregate.loadFromHistory();
    if (!aggregate.exist) throw new Error(`Message ${id} does not exist`);
    const event = new CommentAdded({
        id: v4(),
        content: comment,
        messageId: id,
        author: author
    });
    new EventBus().publish(event);
}

export const editComment = (messageId: string, editedComment: string, commentId: string) => {
    const aggregate = new MessageAggregate(messageId);
    aggregate.loadFromHistory();
    if (!aggregate.exist) throw new Error(`Message ${messageId} does not exist`);
    if (!aggregate.commentExist(commentId)) throw new Error(`Comment ${commentId} does not exist`);
    const event = new CommentEdited({
        id: commentId,
        content: editedComment,
        messageId
    });
    new EventBus().publish(event);
}

export const addLike = (id: string, username: string) => {
    const aggregate = new MessageAggregate(id);
    aggregate.loadFromHistory();
    if (!aggregate.exist) throw new Error(`Message ${id} does not exist`);
    if (aggregate.userHasLiked(username)) throw new Error(`User ${username} already like message ${id}`);
    const event = new LikeAdded({
        id,
        username
    });
    new EventBus().publish(event);
}

export const removeLike = (id: string, username: string) => {
    const aggregate = new MessageAggregate(id);
    aggregate.loadFromHistory();
    if (!aggregate.exist) throw new Error(`Message ${id} does not exist`);
    if (!aggregate.userHasLiked(username)) throw new Error(`User ${username} does not like message ${id}`);
    const event = new LikeRemoved({
        id,
        username
    });
    new EventBus().publish(event);
}