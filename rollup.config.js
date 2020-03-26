import resolve from 'rollup-plugin-node-resolve';
export default {
  input: 'src_site/js/data.src.js',
  plugins: [
    resolve(),
  ],
  context: 'null',
  moduleContext: 'null',
  output: {
    file: 'src_site/js/data.esm.js',
    format: 'esm',
  }
};