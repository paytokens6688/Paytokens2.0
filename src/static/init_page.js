// 页面初始化函数
function initPage () {
  // 如果没有加载页面，等待16.7ms后重试
  if (!document.body) return setTimeout(initPage, 16.7);
  // 全局字体生成
  const userPhoneSize = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  document.body.style['transform'] = 'translate(0px, 0px)';
  document.body.style['webkitTransform'] = 'translate(0px, 0px)';
  document.body.style['mozTransform'] = 'translate(0px, 0px)';
  document.body.style['msTransform'] = 'translate(0px, 0px)';
  document.body.style['oTransform'] = 'translate(0px, 0px)';
  // 判断宽高，处理body
  if (userPhoneSize.width < userPhoneSize.height) return (document.documentElement.style['font-size'] = (userPhoneSize.width / 7.5) + 'px');
  document.documentElement.style['font-size'] = (userPhoneSize.height * 375 / 667 / 7.5) + 'px';
  document.body.style['width'] = userPhoneSize.height * 375 / 667 + 'px';
  document.body.style['margin'] = '0 auto';
  document.body.style['border'] = '1px solid #ccc';
}

initPage();
