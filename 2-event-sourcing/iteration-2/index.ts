import { program } from "commander";

import {
    getMessages,
    getMessage,
    addMessage,
    editMessage,
    addComment,
    editComment,
    addLike,
    removeLike,
    migrate,
    getLastId
} from "./database";

program
    .command("add-message")
    .description("Add a message to the database")
    .requiredOption("-m, --message <message>", "Message to add", "Hi, my name is Slim Shaddy")
    .requiredOption("-a, --author <author>", "Author of the message", "Eminem")
    .action(({message: messageToAdd, author}) => {
        addMessage(messageToAdd, author);
        console.log("Message added");
    });

program
    .command("get-messages")
    .description("Get all messages from the database")
    .action(() => {
        console.log("All messages: ", getMessages());
    });

program
    .command("get-message")
    .description("Get a message from the database")
    .requiredOption("-i, --id <id>", "The id of the message you want to query", "0")
    .action(({id}) => {
        console.log("The message you queried: ", getMessage(id));
    });

program
    .command("edit-message")
    .description("Edit a message from the database")
    .requiredOption("-i, --id <id>", "The id of the message you want to edit", "0")
    .requiredOption("-m, --message <message>", "Edited message", "Hi, my name is not anymore Slim Shaddy")
    .action(({id, message}) => {
        editMessage(id, message);
        console.log("The message is edited");
    });

program
    .command("add-comment")
    .description("Add a comment to a message")
    .requiredOption("-i, --id <id>", "The id of the message you want to edit", "0")
    .requiredOption("-c, --comment <comment>", "Comment of the message", "Hey, i love you")
    .requiredOption("-a, --author <author>", "Author of the message", "Eminem")
    .action(({id, comment, author}) => {
        addComment(id, comment, author);
        console.log("The comment was added to the message");
    });

program
    .command("edit-comment")
    .description("Edit a comment from a message")
    .requiredOption("-i, --id <id>", "The id of the message you want to edit", "0")
    .requiredOption("-c, --comment <comment>", "The edited comment", "Hey, i don't love you anymore")
    .requiredOption("-ci, --comment-id <comment-id>", "The id of the comment", "0")
    .action(({id, comment, commentId}) => {
        editComment(id, comment, commentId);
        console.log("The comment was edited from the message");
    });

program
    .command("like")
    .description("Like to a message")
    .requiredOption("-i, --id <id>", "The id of the message you want to edit", "0")
    .requiredOption("-u, --username <username>", "The liker username", "Snoop Dogg")
    .action(({id, username}) => {
        addLike(id, username);
        console.log("You add a like to the message");
    });

program
    .command("remove-like")
    .description("Remove like from a message")
    .requiredOption("-i, --id <id>", "The id of the message you want to edit", "0")
    .requiredOption("-u, --username <username>", "The liker username", "Snoop Dogg")
    .action(({id, username}) => {
        removeLike(id, username);
        console.log("You remove a like to the message");
    });

program
    .command("migrate")
    .description("Replay all your events with new handler")
    .action(() => {
        migrate();
        console.log("Migration is done");
    });

program
    .command("get-author-messages")
    .description("Get the uids of messages for an author")
    .requiredOption("-a, --author <author>", "Author of the message", "Eminem")
    .action(({author}) => {
        const messages = getMessages();
        for (const uid of Object.keys(messages)) {
            if (messages[uid][0].author.toLowerCase() === author.toLowerCase())
                console.log(uid);
        }
    });

program
    .command("get-author-comments")
    .description("Get the first uid of comments for an author in a message")
    .requiredOption("-a, --author <author>", "Author of the message", "Eminem")
    .requiredOption("-i, --id <id>", "The id of the message you want to edit", "0")
    .action(({author, id}) => {
        const message = getMessage(id);
        for (const comment of message[getLastId(message)].comments) {
            if (comment.author.toLowerCase() === author.toLowerCase())
                console.log(comment.id);
        }
    });

program.parse(process.argv);
