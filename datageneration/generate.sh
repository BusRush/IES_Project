#!/bin/bash
# ./generate.sh AVRBUS-R0001 064700
# Use the seq command to generate a sequence of numbers from 1 to 40
for i in $(seq 1 5)
do
  for day in "monday" "tuesday" "wednesday" "thursday" "friday"
    do
    python3 mock_generator.py --route_id $1 --route_shift $2 --name_of_file $day/$1-$i.json 
    done   
done
