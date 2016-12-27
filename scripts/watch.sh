#!/bin/sh

#while inotifywait -e modify -q -r ./src; do
#    echo `date +%s` > ./src/version.txt
#done

while inotifywait -e modify -q -r ./src ; do
    touch src/.extension-reloader
done
