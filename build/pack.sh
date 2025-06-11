#!/bin/bash

NOW_PATH=$(cd $(dirname $0); pwd)

PROJECT_ROOT_PATH=$(cd $NOW_PATH/../; pwd)

TARGET_DIR=$PROJECT_ROOT_PATH/packages

if [ ! -d "$TARGET_DIR" ]; then
  mkdir -p "$TARGET_DIR"
fi

node $PROJECT_ROOT_PATH/scripts/revert-dependencies.js
node $PROJECT_ROOT_PATH/scripts/build-package.js --package=all

cd $TARGET_DIR

npm pack ../src/common
npm pack ../src/cheap
npm pack ../src/audioresample
npm pack ../src/audiostretchpitch
npm pack ../src/avcodec
npm pack ../src/avfilter
npm pack ../src/avformat
npm pack ../src/avnetwork
npm pack ../src/avpipeline
npm pack ../src/avplayer
npm pack ../src/avprotocol
npm pack ../src/avrender
npm pack ../src/avtranscoder
npm pack ../src/avutil
npm pack ../src/videoscale

echo "output : '$TARGET_DIR'"
