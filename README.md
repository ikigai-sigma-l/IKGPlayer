## Overview

IKG Player

## Installation Steps

1. install dependencies

```node scripts/initial-project.js```

2. remove quarantine of wat2wasm

```xattr -d src/cheap/build/asm/macos/wat2wasm```

## Local test

```sh ./build/pack.sh```

local packages will be stored in the ```\packages``` folder.

## Publish

1. update package version

```
node scripts/update-version.js --pubVersion=[VERSION]
```

2. publish all packages

```sh ./build/publish.sh```

## Installation Settings

```tsconfig.ts```

```
"compilerOptions": {
    "paths": {
        "@ikigaians/common/*": ["node_modules/@ikigaians/ikgplayer-common/dist/esm/*"],
        "@ikigaians/cheap/*": ["node_modules/@ikigaians/ikgplayer-cheap/dist/esm/*"],
        "@ikigaians/avcodec/*": ["node_modules/@ikigaians/ikgplayer-avcodec/dist/esm/*"],
        "@ikigaians/avformat/*": ["node_modules/@ikigaians/ikgplayer-avformat/dist/esm/*"],
        "@ikigaians/avnetwork/*": ["node_modules/@ikigaians/ikgplayer-avnetwork/dist/esm/*"],
        "@ikigaians/avplayer/*": ["node_modules/@ikigaians/ikgplayer-avplayer/dist/esm/*"],
        "@ikigaians/avprotocol/*": ["node_modules/@ikigaians/ikgplayer-avprotocol/dist/esm/*"],
        "@ikigaians/avrender/*": ["node_modules/@ikigaians/ikgplayer-avrender/dist/esm/*"],
        "@ikigaians/audiostretchpitch/*": ["node_modules/@ikigaians/ikgplayer-audiostretchpitch/dist/esm/*"],
        "@ikigaians/audioresample/*": ["node_modules/@ikigaians/ikgplayer-audioresample/dist/esm/*"],
        "@ikigaians/avpipeline/*": ["node_modules/@ikigaians/ikgplayer-avpipeline/dist/esm/*"],
        "@ikigaians/avtranscode/*": ["node_modules/@ikigaians/ikgplayer-avtranscode/dist/esm/*"],
        "@ikigaians/avutil/*": ["node_modules/@ikigaians/ikgplayer-avutil/dist/esm/*"],
        "@ikigaians/videoscale/*": ["node_modules/@ikigaians/ikgplayer-videoscale/dist/esm/*"],
        "@ikigaians/avfilter/*": ["node_modules/@ikigaians/ikgplayer-avfilter/dist/esm/*"]
    },
    "files": [
        "node_modules/@ikigaians/ikgplayer-cheap/dist/esm/cheapdef.d.ts"
    ]
}
```