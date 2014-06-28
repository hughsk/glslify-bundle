#pragma glslify: dependency = require(./dir/dependency.glsl)

void main() {
  gl_FragColor.rgb = dependency();
  gl_FragColor.a = 1.0;
}
