# Event Sourcing

This repository is the demonstration of how event-sourcing can be used and implemented.

## The project

Imagine you create a platform where people can write/edit message, write/edit comment and like or remove their like on a message.

We do all implementation for the crud part and the event sourcing part so we can see the difference between both.

### First implementation
The first implementation is just a basic crud. You create and edit everything directly.

### Second implementation
You see that you now grow and need to have a message history, to see what was the message before being edited.

### Third implementation
You now need to have also the comments history.

### Fourth implementation
You also need to know who liked or removed their like history.

### Fifth implementation
Now, you need to refactor the database, since it wasn't readable.
