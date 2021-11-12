#!/bin/bash

path_mnt=$1 && shift
path_def=$1 && shift
path_resource=$1 && shift
path_env=$1 && shift

idx=$1
tmp="/tmp/$1/"
cat ${path_mnt}def_operations | awk 'NR=='$1 > ${tmp}ope_comp
shift

opt_flag=$1
ofd_flag=$(($opt_flag&1))

test_name="$(./shjp.sh -g ${tmp}ope_comp name)"
command="$(./shjp.sh -g ${tmp}ope_comp command)"
path_resource=${path_resource}${test_name}/input/
path_work=/work/${test_name}/

cp $path_env $path_work
cp $path_resource $path_work

cd $path_work
eval "$command" > ${tmp}co_result

function end(){
    echo "$idx $1 |||| $test_name"
    exit 0
}

./shjp.sh -g ${tmp}ope_comp expected |
while read check; do

    ./shjp.sh "$check" > ${tmp}check_comp
    act="$(./shjp.sh -g ${tmp}check_comp act)"
    ./shjp.sh -g ${tmp}ope_comp value > ${tmp}expected_v

    if [ $act = console-output ]; then
        difft -q ${tmp}expected_v ${tmp}co_result >/dev/null 2>/dev/null
        [ $? != 0 ] && touch ${tmp}failure || :
    elif [ $ofd_flag = 1 ]; then
        continue
    fi
    
    value=$(cat ${tmp}expected_v)
    if [ $act = file-output ]; then
        diff -rq ${path_work}
    elif [ $act = file-update ]; then

    elif [ $act = file-delete ]; then
    
    fi
done

