#!/bin/bash

tsx index.ts migrate
read -p "Press enter to continue"

tsx index.ts add-message -m "Original5" -a "Moi5"
read -p "Press enter to continue"

messageId=`tsx index.ts get-author-messages -a Moi5`

tsx index.ts edit-message -m "Édité5" -i $messageId
read -p "Press enter to continue"

tsx index.ts add-comment -c "Original5" -a "Lui5" -i $messageId
read -p "Press enter to continue"

commentId=`tsx index.ts get-author-comments -i $messageId -a Lui5`

tsx index.ts edit-comment -c "Édité5" -i $messageId -ci $commentId
read -p "Press enter to continue"

tsx index.ts like -u "Elle5" -i $messageId
read -p "Press enter to continue"

tsx index.ts remove-like -i $messageId -u "Elle5"
