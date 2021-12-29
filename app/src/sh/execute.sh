#!/bin/bash

function printStacktrace() {
    index=1
    while frame=($(caller "${index}")); do
        ((index++))
        echo "at function ${frame[1]} (${frame[2]}:${frame[0]})" >&2
    done
}

function checkErr(){
    if [ $? != 0 ]; then
        printStacktrace
        exit -1
    fi
}

shjp=/cmdbbt/lib/sh/shjp.sh

path_mnt=$1 && shift
path_def=$1 && shift
path_resource=$1 && shift
path_env=$1 && shift

idx=$1
tmp="/tmp/$idx/"
mkdir -p $tmp
cat ${path_mnt}def_operations | 
awk 'NR=='$idx |
$shjp > ${tmp}ope_comp
shift

opt_flag=${1:-0}
ofd_flag=$(($opt_flag&1))

test_name="$($shjp -g ${tmp}ope_comp name)"
command="$($shjp -g ${tmp}ope_comp command)"
path_resource=${path_resource}${test_name}/input/
path_work=/work/${test_name}/
mkdir -p $path_work

for n in `ls $path_env`; do
    cp -r ${path_env}${n} $path_work
done
if [ -d $path_resource ]; then
    for n in `ls $path_resource`; do
        cp -r ${path_resource}${n} $path_work
    done
fi

cd $path_work
eval "$command" > ${tmp}co_result
if [ $? != "$($shjp -g ${tmp}ope_comp exitCode)" ]; then
    touch ${tmp}failure
    exit 0
fi

$shjp -g ${tmp}ope_comp expected |
while read check; do

    $shjp $check > ${tmp}check_comp
    act="$($shjp -g ${tmp}check_comp act)"
    $shjp -g ${tmp}check_comp value > ${tmp}expected_v

    if [ $act = console-output ]; then
        :
    elif [ $act = console-output ]; then
        diff -q ${tmp}expected_v ${tmp}co_result >/dev/null 2>/dev/null
        if [ $? != 0 ]; then
            touch ${tmp}failure
            break
        fi
    elif [ $ofd_flag = 1 ]; then
        continue
    fi
    
    value=$(cat ${tmp}expected_v)
    if [ $act = file-output ]; then
        diff -rq ${path_work}
    elif [ $act = file-update ]; then
        :
    elif [ $act = file-delete ]; then
        :
    fi
done
checkErr

exit 0
