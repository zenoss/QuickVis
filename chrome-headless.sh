#! /bin/bash

# echo "starting xvfb and chrome and pointing to '$1'"
#Xvfb :2 -screen 5 1024x768x8 &
#export DISPLAY=:2.5
#xvfb-run --server-args='-screen 5, 1024x768x16' \
#    google-chrome --no-sandbox --user-data-dir "" "$1"

echo "starting run-headless-chromium and pointing to '$1'"
node_modules/run-headless-chromium/run-headless-chromium.js $1 --no-sandbox
