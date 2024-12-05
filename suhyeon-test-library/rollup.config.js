import babel from '@rollup/plugin-babel'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import cssimport from 'postcss-import'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'

export default [
    {
        input: './src/index.ts', // 진입 경로
        output: [
            {
                dir: 'dist/esm',
                format: 'es',
                sourcemap: true,
            },
            {
                dir: 'dist',
                format: 'cjs',
                sourcemap: true,
            },
        ],
        plugins: [
            resolve({
                extensions: ['.js', '.jsx', '.ts', '.tsx'], // 확장자 해석 추가
            }),
            babel({
                babelHelpers: 'bundled',
                presets: ['@babel/preset-env', '@babel/preset-react'],
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
                include: 'node_modules/**',
            }),
            peerDepsExternal(),
            typescript({
                outDir: './dist/esm',
                declaration: true,
                declarationDir: './dist/esm',
            }),
            postcss({
                modules: true, // CSS 모듈 활성화
                extensions: ['.css', '.scss'],
                plugins: [cssimport(), autoprefixer()],
            }),
        ],
    },
    {
        input: './dist/esm/index.d.ts',
        output: [{ file: 'dist/index.d.ts', format: 'es' }],
        external: [/\.css$/], // css파일이 존재할 경우, 추가
        plugins: [dts()],
    },
]
