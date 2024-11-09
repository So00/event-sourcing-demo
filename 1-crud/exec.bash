#!/bin/bash
crudRootPath=`pwd`

echo "START OF CRUD ITERATION\n"

echo "----------FIRST ITERATION----------"
cd $crudRootPath/iteration-1
bash exec.bash
echo "----------END OF FIRST ITERATION----------"
read -p "Press enter to continue"

echo "----------SECOND ITERATION----------"
cd $crudRootPath/iteration-2
bash exec.bash
echo "----------END OF SECOND ITERATION----------"
read -p "Press enter to continue"

echo "----------THIRD ITERATION----------"
cd $crudRootPath/iteration-3
bash exec.bash
echo "----------END OF THIRD ITERATION----------"
read -p "Press enter to continue"

echo "----------FOURTH ITERATION----------"
cd $crudRootPath/iteration-4
bash exec.bash
echo "----------END OF FOURTH ITERATION----------"
read -p "Press enter to continue"

echo "----------FIFTH ITERATION----------"
cd $crudRootPath/iteration-5
bash exec.bash
echo "----------END OF FIFTH ITERATION----------"
read -p "Press enter to end"
