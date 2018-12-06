# Paytokens2.0前台源代码

## 技术架构
  - yarn/npm(包管理工具)
  - vue(前端框架)
  - vue-router(路由处理工具)
  - vuex(状态管理插件)
  - vue-ssr/nuxt(服务端渲染)
  - websocket(双向链接)
  - D3.js/three.js/echart.js(图表制作工具)
  - https(请求加密)
  - ServiceWorker(PWA弱网环境支持)
  - axios(网络请求)
  - eosjs(EOS支持/为支持https，使用中间转接方式)
  - web3(ETH支持/为支持https，使用中间转接方式)
  - bitcore-explorers(BTC支持/可能需要更改，这是用的其他节点)
  - bitcore-lib(BTC核心支持)
  - ethereum-bip44(助记词处理支持)
  - sass/scss(css预处理工具)
  - babel-polyfill(es6兼容处理工具)
  - postcss-px2rem(移动端rem字体适配处理工具)
  - clipboard(js复制支持)
  - vue-qrcode(vue二维码绘制支持)
  - qs(网络请求数据格式预处理支持)
  - node(搭建中间层使用)
  - indexDB/localStorage(前台储存方式)
  - hammerjs(移动端手势处理插件)

## 目录文件架构
[参考nuxt官方目录结构](https://zh.nuxtjs.org/guide/directory-structure)

- / 项目根目录储存本项目所有代码
    - /.nuxt 目录储存打包运行的服务端代码
    - /explain 目录储存前端项目详细说明
    - /node_modules 目录储存引入包文件
    - /server 目录储存node服务端入口文件
    - /src 目录储存项目源代码
      - /src/assets 未编译的静态资源目录
      - /src/components vue组件目录
      - /src/layouts nuxt规定布局目录
      - /src/middleware 项目处理中间件目录
      - /src/pages nuxt规定页面目录
      - /src/plugins 项目处理插件目录
      - /src/static nuxt规定静态文件目录
      - /src/store nuxt规定vuex状态树文件目录
      - /src/user_conf /nuxt.conf.js文件补充配置目录
    - /.editorcoinfg 文件储存项目编辑器配置
    - /.eslintrc.js 文件储存项目eslint配置
    - /.gitignore 文件储存git配置
    - /.prettierrc 文件储存格式化钩子配置
    - /nuxt.config.js 文件储存nuxt项目配置
    - /package.json 文件储存引入包文件信息及部分node配置
    - /READMWE.md 文件储存项目总说明
    - /yarn.lock yarn工具包管理文件

## 项目引用包(需掌握)
- [localforage](https://github.com/localForage/localForage)(前台储存)
- [axios](https://github.com/axios/axios)(网络请求)

## 代码格式规范
- 文件名字用_做为连词符
- 组件根元素使用class命名，不允许使用id
- 组件class类名链接符使用-
- 页面根元素必须使用id
- 页面sass必须以页面根元素id为起始，防止变量冲突
- id使用驼峰命名法
- 页面class类名链接符使用_
- 每个变量作用需要注释说明
- 每个功能函数需要注释说明作用
- vuex的功能函数使用方法需要在/store/README.md里说明
- html标签属性数量大于等于两条需要换行处理
- html标签属性顺序为：静态属性->动态属性->绑定属性->绑定方法
- 使用hammerjs方式触发事件，@click使用v-tap代替
    ``` javascript
      // 带参数methods函数写法，callback函数在绑定时会直接执行，所以需要返回一个函数
      callback (arg1, arg2) {
        return () => {
          console.log(arg1, arg2);
        };
      }
      // 不带参数methods函数写法
      callback () {
        console.log(123);
      }
    ```