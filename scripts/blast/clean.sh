#!/bin/bash
strains=( muridarum pneumoniae trachomatis_434 trachomatis_duw )

for query in 0 1 2 3
do
   for subject in 0 1 2 3
   do
     target1=$(printf "parsed_%s_v_%s.tab" "${strains[query]}" "${strains[subject]}")
     target2=$(printf "unparsed_%s_v_%s.tab" "${strains[query]}" "${strains[subject]}")
     echo "Deleting " ${strains[query]} " v " ${strains[subject]}
     rm $target1
     rm $target2
   done

done

echo "All Clean!"
