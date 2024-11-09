#!/bin/bash
eventSourcingRootPath=`pwd`

echo "START OF EVENT-SOURCING ITERATION\n"

echo "----------FIRST ITERATION----------"
cd $eventSourcingRootPath/iteration-1
bash exec.bash
echo "----------END OF FIRST ITERATION----------"
read -p "Press enter to continue"

echo "----------SECOND ITERATION----------"
cd $eventSourcingRootPath/iteration-2
bash exec.bash
echo "----------END OF SECOND ITERATION----------"
read -p "Press enter to continue"

echo "----------THIRD ITERATION----------"
cd $eventSourcingRootPath/iteration-3
bash exec.bash
echo "----------END OF THIRD ITERATION----------"
read -p "Press enter to continue"

echo "----------FOURTH ITERATION----------"
cd $eventSourcingRootPath/iteration-4
bash exec.bash
echo "----------END OF FOURTH ITERATION----------"
read -p "Press enter to continue"

echo "----------FIFTH ITERATION----------"
cd $eventSourcingRootPath/iteration-5
bash exec.bash
echo "----------END OF FIFTH ITERATION----------"
read -p "Press enter to end"
