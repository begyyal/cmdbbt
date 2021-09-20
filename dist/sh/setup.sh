#!/bin/sh

echo $@ 
for i in `seq 5`; do
    sleep 1
    echo $i
done