module.exports = {
  title: 'Paytokens',
  meta: [
    {
      charset: 'utf-8'
    }, {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
    }, {
      name: 'apple-mobile-web-app-capable',
      content: 'yes'
    }, {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'blue'
    }, {
      name: 'format-detection',
      content: 'telephone=no'
    }, {
      name: 'Keywords',
      content: '区块链跨链钱包'
    }, {
      name: 'screen-orientation',
      content: 'portrait'
    }, {
      name: 'full-screen',
      content: 'yes'
    }, {
      name: 'x5-orientation',
      content: 'portrait'
    }, {
      name: 'x5-fullscreen',
      content: 'true'
    }, {
      name: 'x5-page-mode',
      content: 'app'
    }, {
      name: 'apple-mobile-web-app-capable',
      content: 'yes'
    }, {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'blue'
    }, {
      hid: 'description',
      name: 'description',
      content: '区块链跨链钱包'
    }
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }
  ],
  // 添加js配置
  script: [
    {
      src: '/init_page.js',
      type: 'text/javascript'
    },
    {
      src: '/_nuxt/service_worker.js',
      type: 'text/javascript'
    }
  ]
};
