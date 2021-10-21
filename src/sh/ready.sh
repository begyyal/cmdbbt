#!/bin/bash

work_path=$1
def_path=$2

tmp=${work_path}/tmp/
mkdir -p ${tmp}

./shjp $def_path > ${tmp}comp
./shjp -g ./comp operations > ${tmp}operations
