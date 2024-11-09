#!/bin/bash

tsx index.ts migrate
read -p "Press enter to continue"

tsx index.ts add-message -m "Original3" -a "Moi3"
read -p "Press enter to continue"

messageId=`tsx index.ts get-author-messages -a Moi3`

tsx index.ts edit-message -m "Édité3" -i $messageId
read -p "Press enter to continue"

tsx index.ts add-comment -c "Original3" -a "Lui3" -i $messageId
read -p "Press enter to continue"

commentId=`tsx index.ts get-author-comments -i $messageId -a Lui3`

tsx index.ts edit-comment -c "Édité3" -i $messageId -ci $commentId
read -p "Press enter to continue"

tsx index.ts like -u "Elle3" -i $messageId
read -p "Press enter to continue"

tsx index.ts remove-like -i $messageId -u "Elle3"
