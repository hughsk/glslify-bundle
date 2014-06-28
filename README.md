# glslify-bundle [![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

A wrapper module for bundling glslify scripts using common functionality within
the glslify module ecosystem.

Normalizes the API to closely match what's seen when using
[glslify as a browserify transform](https://github.com/chrisdickinson/glslify#as-a-browserify-transform),
such that when dealing with the simple case it can be used more quickly in other
modules.

## Usage

[![NPM](https://nodei.co/npm/glslify-bundle.png)](https://nodei.co/npm/glslify-bundle/)

### bundle(cwd, options, done)

* `cwd` is the working directory of any inline shaders.
* `options` is an object literal, and should support any of the parameters
  you can use when using the browserify transform. Notably, `frag` and `vert`
  are optional.
* `done(err, result)` is called when ready.

### result.frag
The bundled fragment shader.

### result.vert
The bundled vertex shader.

### result.files
An array of files that were used within the bundling process.

## License

MIT. See [LICENSE.md](http://github.com/hughsk/glslify-bundle/blob/master/LICENSE.md) for details.
