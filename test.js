var test   = require('tape')
var bundle = require('./')
var fs     = require('fs')

var dep      = __dirname + '/fixtures/dir/dependency.glsl'
var filename = __dirname + '/fixtures/simple.glsl'
var dirname  = __dirname + '/fixtures'

test('simple test', function(t) {
  bundle(dirname, {
      frag: fs.createReadStream(filename)
    , transform: ['glslify-hex']
  }, function(err, result) {
    if (err) return t.fail(err.message)

    t.equal(result.files.length, 1, 'correct number of files')
    t.equal(result.files[0], dep, 'dep filename included in files')

    t.equal(result.vert, ' ', 'use an empty string when not supplied a shader')
    t.ok(/vec3\(1\.0?, 0?\.4, 0?\.2\)/g.test(result.frag), 'included/transformed child file')

    t.end()
  })
})

test('passing in file names', function(t) {
  bundle(dirname, {
      frag: filename
    , transform: ['glslify-hex']
  }, function(err, result) {
    if (err) return t.fail(err.message)

    t.equal(result.files.length, 2, 'correct number of files')
    t.end()
  })
})
