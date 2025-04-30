import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/app.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    // 1) Заменяем process.env.* на реальные переменные из окружения
    replace({
      preventAssignment: true,
      'process.env.FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
      'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
      'process.env.FIREBASE_PROJECT_ID': JSON.stringify(process.env.FIREBASE_PROJECT_ID),
      'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
      'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
      'process.env.FIREBASE_APP_ID': JSON.stringify(process.env.FIREBASE_APP_ID),
      'process.env.OPENWEATHER_API_KEY': JSON.stringify(process.env.OPENWEATHER_API_KEY),
      'process.env.TRANSFERS_API_URL': JSON.stringify(process.env.TRANSFERS_API_URL),
      // …добавь остальные ключи, которые ты выносил
    }),
    resolve(),      // чтобы Rollup понимал import/require внешних модулей
    commonjs(),     // чтобы преобразовывать CommonJS-библиотеки
    terser()        // минификация
  ]
};
