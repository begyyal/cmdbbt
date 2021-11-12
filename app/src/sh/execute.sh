#!/bin/bash

path_work=$1 && shift
path_def=$1 && shift
path_resource=$1 && shift
path_env=$1 && shift
tmp="/tmp/$1/"

cat ${path_work}def_operations | awk 'NR=='$1 > ${tmp}ope_comp
test_name="$(./shjp.sh -g ${tmp}ope_comp name)"
command="$(./shjp.sh -g ${tmp}ope_comp command)"

cp ${path_resource}${test_name}input

