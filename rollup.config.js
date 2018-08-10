import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';

function getConfig({ input, dest, format, uglified = true, transpiled = false }) {
  const conf = {
    input: input,
    output: { file: dest, format, sourcemap: true },
    plugins: [
      transpiled &&
        babel({
          presets: [['env', { modules: false }]],
          plugins: ['external-helpers']
        }),
      uglified &&
        uglify({
          warnings: true,
          keep_fnames: true,
          sourceMap: true,
          compress: { passes: 2 },
          mangle: { properties: false, keep_fnames: true }
        })
    ].filter(Boolean)
  };

  return conf;
}

export default getConfig({ input: './dist/index.js', dest: 'dist/index.es5.js', format: 'iife', transpiled: true });
