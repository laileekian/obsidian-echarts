import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import replace from '@rollup/plugin-replace'

const isProd = process.env.BUILD === 'production'

export default {
  input: './src/main.ts',
  output: {
    dir: '.',
    sourcemap: 'inline',
    sourcemapExcludeSources: isProd,
    format: 'cjs',
    exports: 'default',
  },
  // Mark echarts-wordcloud as external so it is NOT bundled into main.js.
  // Its Canvas-heavy initialisation code crashes iOS/WKWebView at eval time.
  external: ['obsidian', 'echarts-wordcloud'],
  plugins: [
    // Replace process.env.NODE_ENV so iOS (which has no `process` global)
    // doesn't throw a ReferenceError at plugin load time.
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true,
    }),
    typescript(),
    nodeResolve({ browser: true }),
    commonjs(),
    postcss({
      extract: true,
      extract: 'styles.css',
    }),
  ],
}
