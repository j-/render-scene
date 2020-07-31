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

### Add bin directory to PATH

`bin/` must be in PATH

```
export PATH="./bin:$PATH"
```

Rendering
---------

Rendering configuration is defined in `src/config.json`.

### Render frames

Individual frames must be rendered first.

```
$ render-frames
```

### Render video

Video can be rendered after frames.

```
$ render-video
```
