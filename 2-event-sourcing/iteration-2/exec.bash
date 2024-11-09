#!/bin/bash

tsx index.ts migrate
read -p "Press enter to continue"

tsx index.ts add-message -m "Original2" -a "Moi2"
read -p "Press enter to continue"

messageId=`tsx index.ts get-author-messages -a Moi2`

tsx index.ts edit-message -m "Édité2" -i $messageId
read -p "Press enter to continue"

tsx index.ts add-comment -c "Original2" -a "Lui2" -i $messageId
read -p "Press enter to continue"

commentId=`tsx index.ts get-author-comments -i $messageId -a Lui2`

tsx index.ts edit-comment -c "Édité2" -i $messageId -ci $commentId
read -p "Press enter to continue"

tsx index.ts like -u "Elle2" -i $messageId
read -p "Press enter to continue"

tsx index.ts remove-like -i $messageId -u "Elle2"
