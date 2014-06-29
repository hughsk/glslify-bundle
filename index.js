var glslify  = require('glslify-stream')
var deparser = require('glsl-deparser')
var concat   = require('concat-stream')
var combine  = require('multipipe')
var from     = require('new-from')
var resolve  = require('resolve')
var path     = require('path')
var once     = require('once')
var fs       = require('fs')

module.exports = bundle

function bundle(cwd, options, done) {
  var frag      = options.frag || options.fragment
  var vert      = options.vert || options.vertex
  var transform = options.transform || []
  var inline    = options.inline
  var filename  = cwd && path.resolve(cwd, '__entry.glsl')

  var opts   = { transform: transform , input: true }
  var result = {}
  var files  = result.files = []

  done = once(done)

  // Some messy normalisation going on here.
  //
  // * If a stream, use a dummy file name.
  // * If an inline shader string, use a dummy name and convert to a stream
  // * If a file path, use fs.createReadStream
  // * If not supplied, ignore it

  var vertname = filename
  var fragname = filename

  if (vert && typeof vert === 'string') {
    if (!inline) {
      vertname = vert
      vert = resolve.sync(vert, { basedir: cwd })
      vert = fs.createReadStream(vert, 'utf8')
    } else {
      vert = from([vert])
    }
  }

  if (frag && typeof frag === 'string') {
    if (!inline) {
      fragname = frag
      frag = resolve.sync(frag, { basedir: cwd })
      frag = fs.createReadStream(frag, 'utf8')
    } else {
      frag = from([frag])
    }
  }

  vertname = path.resolve(vertname)
  fragname = path.resolve(fragname)
  handle(vert, vert && glslify(vertname, opts), 'vert')
  handle(frag, frag && glslify(fragname, opts), 'frag')

  function handle(inputStream, outputStream, key) {
    if (!outputStream) {
      return check(result[key] = ' ')
    }

    combine(
        outputStream.on('file', pushFile)
      , deparser()
      , concat(function(data) {
        check(result[key] = data)
      })
    ).on('error', done)

    if (inputStream) {
      inputStream.pipe(outputStream)
    }
  }

  function pushFile(file) {
    if (file === filename) return
    files.push(file)
  }

  function check() {
    if (!result.vert) return
    if (!result.frag) return
    done(null, result)
  }
}
