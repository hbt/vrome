#!/bin/sh

while inotifywait -e modify -q -r ./src; do
    echo `date +%s` > ./src/version.txt
done
