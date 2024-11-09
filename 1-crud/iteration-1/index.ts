import { program } from "commander";

import {
    getMessages,
    getMessage,
    addMessage,
    editMessage,
    addComment,
    editComment,
    addLike,
    removeLike
} from "./database";

program
    .command("add-message")
    .description("Add a message to the database")
    .requiredOption("-m, --message <message>", "Message to add", "Hi, my name is Slim Shaddy")
    .requiredOption("-a, --author <author>", "Author of the message", "Eminem")
    .action(({message: messageToAdd, author}) => {
        const message = addMessage(messageToAdd, author);
        console.log("Message added: ", message);
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
        console.log("The message you edit: ", editMessage(id, message));
    });

program
    .command("add-comment")
    .description("Add a comment to a message")
    .requiredOption("-i, --id <id>", "The id of the message you want to edit", "0")
    .requiredOption("-c, --comment <comment>", "Comment of the message", "Hey, i love you")
    .requiredOption("-a, --author <author>", "Author of the message", "Eminem")
    .action(({id, comment, author}) => {
        console.log("The comment was added to the message : ", addComment(id, comment, author));
    });

program
    .command("edit-comment")
    .description("Edit a comment from a message")
    .requiredOption("-i, --id <id>", "The id of the message you want to edit", "0")
    .requiredOption("-c, --comment <comment>", "The edited comment", "Hey, i don't love you anymore")
    .requiredOption("-a, --author <author>", "Author of the message", "Eminem")
    .requiredOption("-ci, --comment-id <comment-id>", "The id of the comment", "0")
    .action(({id, comment, commentId}) => {
        console.log("The comment was edited from the message : ", editComment(id, comment, commentId));
    });

program
    .command("like")
    .description("Like to a message")
    .requiredOption("-i, --id <id>", "The id of the message you want to edit", "0")
    .requiredOption("-u, --username <username>", "The liker username", "Snoop Dogg")
    .action(({id, username}) => {
        console.log("You add a like to the message : ", addLike(id, username));
    });

program
    .command("remove-like")
    .description("Remove like to a message")
    .requiredOption("-i, --id <id>", "The id of the message you want to edit", "0")
    .requiredOption("-u, --username <username>", "The liker username", "Snoop Dogg")
    .action(({id, username}) => {
        console.log("You remove a like to the message : ", removeLike(id, username));
    });

program.parse(process.argv);