module.exports = [
  require('postcss-import')(),
  require('postcss-url')(),
  require('autoprefixer')({
    browsers: [
      '> 0.0001%',
      'last 4 versions',
      'not ie <= 8'
    ]
  }),
  require('postcss-px2rem')({
    remUnit: 100
  })
];
