#! /bin/bash
echo "starting run-headless-chromium and pointing to '$1'"
node_modules/run-headless-chromium/run-headless-chromium.js $1 --no-sandbox
