#!/bin/bash

work_path=$1
def_path=$2

tmp=${work_path}/tmp/
mkdir -p ${tmp}

index=1
./shjp.sh $def_path > ${tmp}comp
./shjp.sh -g ${tmp}comp operations |
while read line; do
    ./shjp.sh "$line" > ${tmp}comp_ope
    case_name=$(./shjp.sh -g ${tmp}comp_ope name)
    if [ $? != 0 ]; then
        echo 'Error occured.' >&2
        exit 1
    fi
    case_dir=${work_path}${case_name}
    mkdir -p $case_dir
    cp ${tmp}comp_ope $case_dir
    echo $case_name
done
if [ $? != 0 ]; then
    echo 'Error occured.' >&2
    exit 1
fi

rm -rdf $tmp
