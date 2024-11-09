#!/bin/bash

tsx index.ts add-message -m "Original1" -a "Moi1"
read -p "Press enter to continue"

messageId=`tsx index.ts get-author-messages -a Moi1`

tsx index.ts edit-message -m "Édité1" -i $messageId
read -p "Press enter to continue"

tsx index.ts add-comment -c "Original1" -a "Lui1" -i $messageId
read -p "Press enter to continue"

commentId=`tsx index.ts get-author-comments -i $messageId -a Lui1`

tsx index.ts edit-comment -c "Édité1" -i $messageId -ci $commentId
read -p "Press enter to continue"

tsx index.ts like -u "Elle1" -i $messageId
read -p "Press enter to continue"

tsx index.ts remove-like -i $messageId -u "Elle1"
