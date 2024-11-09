#!/bin/bash

tsx index.ts migrate
read -p "Press enter to continue"

tsx index.ts add-message -m "Original4" -a "Moi4"
read -p "Press enter to continue"

messageId=`tsx index.ts get-author-messages -a Moi4`

tsx index.ts edit-message -m "Édité4" -i $messageId
read -p "Press enter to continue"

tsx index.ts add-comment -c "Original4" -a "Lui4" -i $messageId
read -p "Press enter to continue"

commentId=`tsx index.ts get-author-comments -i $messageId -a Lui4`

tsx index.ts edit-comment -c "Édité4" -i $messageId -ci $commentId
read -p "Press enter to continue"

tsx index.ts like -u "Elle4" -i $messageId
read -p "Press enter to continue"

tsx index.ts remove-like -i $messageId -u "Elle4"
