Render scene
============

Setup
-----

### Add config file

Save this config file as `src/config.json`.

```json
{
  "name": "xor-boxes",
  "common": {
    "time": 10000,
    "fps": 25
  },
  "preview": {
    "width": 500,
    "height": 500
  },
  "render": {
    "width": 1500,
    "height": 1500
  }
}

```

### Add ffmpeg to PATH

[Download ffmpeg](https://ffmpeg.org/) and add it to PATH.

Rendering
---------

Rendering configuration is defined in `src/config.json`.

### Render frames

Individual frames must be rendered first.

```
$ ./scripts/render-frames
```

### Render video

Video can be rendered after frames.

```
$ ./scripts/render-video
```

### Render both

For convenience.

```
$ ./scripts/render
```

Troubleshooting
---------------

### node-pre-gyp errors on install

#### Mac OS

Install dependencies for canvas package with brew:

```
$ brew install pkg-config cairo pango libpng jpeg giflib librsvg
```
