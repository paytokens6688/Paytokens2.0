const headConf = require('./src/user_conf/head.conf');
const postcssConf = require('./src/user_conf/postcss.conf');
// 引入ws自动插件
const WsJson = require('./src/plugins/webpack_ws_json');

module.exports = {
  // universal
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: headConf,

  /*
  ** Customize the progress-bar color
  */
  loading: './../src/components/popup/bar.vue',

  /*
  ** Global CSS
  */
  css: [
    '@/assets/scss/reset.scss',
    '@/assets/scss/nuxt_reset.scss',
    '@/assets/scss/ele_public.scss',
    '@/assets/font/iconfont.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {
      src: '@/plugins/self_bind',
      ssr: false
    },
    {
      src: '@/plugins/often_func_vue_add',
      ssr: false
    },
    {
      src: '@/plugins/global_components',
      ssr: false
    },
    {
      src: '@/plugins/swiper',
      ssr: false
    },
    {
      src: '@/plugins/axiosInterceptors',
      ssr: true
    },
    {
      src: '@/plugins/global_config',
      ssr: false
    }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
  ],

  srcDir: 'src',

  router: {
    middleware: 'router-middle'
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        });
      }
      if (config.mode === 'production') {
        const CopyWebpackPlugin = require('copy-webpack-plugin');
        const path = require('path');
        config.plugins.push(
          new CopyWebpackPlugin([
            {
              from: path.resolve(__dirname, './src/service_woker'),
              to: path.resolve(__dirname, config.output.path)
            }
          ])
        );
        config.plugins.push(new WsJson());
      }
    },
    postcss: postcssConf
  },
  server: {}
};
