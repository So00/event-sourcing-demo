#!/bin/bash
tsx index.ts add-message -m "Original1" -a "Moi1"
read -p "Press enter to continue"

tsx index.ts edit-message -m "Édité1" -i 0
read -p "Press enter to continue"

tsx index.ts add-comment -c "Original1" -a "Lui1" -i 0
read -p "Press enter to continue"

tsx index.ts edit-comment -c "Édité1" -i 0 -ci 0
read -p "Press enter to continue"

tsx index.ts like -u "Elle1" -i 0
read -p "Press enter to continue"

tsx index.ts remove-like -i 0 -u "Elle1"
