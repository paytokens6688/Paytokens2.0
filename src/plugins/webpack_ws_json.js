// ws中webpack插件
class WsJson {
  constructor (opts = {}) {
    this.opts = opts;
  }
  apply (compiler) {
    compiler.plugin('afterEmit', function (compilation) {
      const fs = require('fs');
      const path = require('path');
      let fileContent = JSON.stringify(
        Object.keys(compilation.assets)
          .filter(item => /^(?!sw\/).*\.(js|jpg|png|gif)$/.test(item))
          .map((item, index) => {
            return {
              revision: `${index}${(new Date()).getTime()}`,
              url: `/_nuxt/${item}`
            };
          }),
        null,
        2
      );
      fileContent = `self.__precacheManifest = ${fileContent}`;
      fs.writeFileSync(
        path.join(compilation.compiler.outputPath, 'precache-manifest.js'),
        fileContent,
        'utf8'
      );
    });
  }
}

module.exports = WsJson;
