// 常用函数总汇

class VueFunc {
  // 格式化时间
  formatDate (time) {
    let newDate = this.isRealDate(time);
    let year = this.numberAddZero(newDate.getFullYear());
    let month = this.numberAddZero(newDate.getMonth() + 1);
    let day = this.numberAddZero(newDate.getDate());
    let hour = this.numberAddZero(newDate.getHours());
    let min = this.numberAddZero(newDate.getMinutes());
    let sec = this.numberAddZero(newDate.getSeconds());
    return `${year}/${month}/${day} ${hour}:${min}:${sec}`;
  };
  // 判断是否是正确时间格式
  isRealDate (time) {
    let realDate = new Date();
    if (typeof time === 'object') { // 如果是实例化的时间
      try {
        realDate = new Date(time);
      } catch (err) {
        return this.error('时间格式化输入格式不正确');
      }
    } else if (Number(time).toString() !== 'NaN') { // 如果是一个数字
      try {
        realDate = new Date(time);
      } catch (err) {
        return this.error('时间格式化输入格式不正确');
      }
    } else {
      return this.error('时间格式化输入格式不正确');
    }
    return realDate;
  };
  // 数字判断，一位数字前加0
  numberAddZero (number) {
    number = Number(number);
    return (number < 10 ? '0' + number : number);
  };
  // 将时间转化为最接近的小时/分/秒，超过24小时，返回时间/传入格式化时间
  setTimeToPersonRead (time) {
    let thisTime = (new Date()).getTime();
    const newTime = (new Date()).getTime();
    try {
      thisTime = (new Date(time)).getTime();
    } catch (err) {
      return this.error('传入时间格式不正确');
    }
    const disTime = newTime - thisTime;
    if (disTime > 86400000) { // 大与一天
      return this.formatDate(new Date(time));
    } else if (disTime > 3600000) { // 大于一小时
      return `${Math.floor(disTime / 3600000)}小时前`;
    } else if (disTime > 60000) { // 大于一分钟
      return `${Math.floor(disTime / 60000)}分钟前`;
    } else { // 小于一分钟
      return `${Math.floor(disTime / 1000) ? Math.floor(disTime / 1000) : 1}秒前`;
    }
  };
  // 拷贝方法
  copyToClipboard (selecter) {
    const ClipboardJS = require('clipboard');
    let clipboard = new ClipboardJS(selecter);
    clipboard.on('success', () => {
      window.$nuxt.$global.successOptions('复制成功');
    });
    clipboard.on('error', () => {
      window.$nuxt.$global.successOptions('复制成功');
    });
    return true;
  };
  // 判断交易密码格式是否正确
  realPayPass (pass) {
    const realPass = /^(?=\d+[a-z|A-Z]+|[a-z|A-Z]+\d+)[\d|a-z|A-Z]{8,16}$/.test(pass);
    return realPass;
  };
  // 错误警告
  error (message) {
    console.error(Error(message));
  };
  // 数组求和
  arrSum (arr) {
    if (arr.length === 0) return 0;
    return arr.reduce((prev, curr) => (prev + curr));
  };
  // 保留字符串数字保留位数
  numberStrSub (str, num = 4) {
    if (str.match(/\./)) {
      return str.substring(0, str.match(/\./).index + num + 1);
    } else {
      return str;
    }
  };
  // 截图工具，返回base64
  screenshotToBase (ele, notShowList = []) {
    const html2canvas = require('html2canvas');
    return new Promise((resolve) => {
      html2canvas(ele, {
        scale: 2,
        useCORS: true,
        logging: false,
        ignoreElements: (element) => (notShowList.indexOf(element) !== -1)
      }).then((canvas) => {
        const ctx = canvas.getContext('2d');
        const bottomImg = new Image();
        const waterImg = new Image();
        const width = canvas.width;
        const height = canvas.height;
        // 加载了几张图片
        let loadingPicNumber = 0;
        // 需要加载几张图片
        const needPicNumber = 2;
        bottomImg.onload = () => {
          loadingPicNumber++;
          ctx.drawImage(bottomImg, 0, height - width / 5.25, width, width / 5.25);
          callbackFunc();
        };
        waterImg.onload = () => {
          loadingPicNumber++;
          const picWidth = width / 4;
          const picHeight = picWidth / 1.7;
          // 默认
          const defaultListWidth = 20;
          // 设置
          let listHeight = 100;
          let listWidth = defaultListWidth;
          // 一行几个
          const oneLineNumber = 2;
          // 一列几个
          const onVerNumber = 5;
          for (let i = 0; i < onVerNumber; i++) {
            listWidth = defaultListWidth;
            for (let j = 0; j < oneLineNumber; j++) {
              ctx.drawImage(waterImg, listWidth, listHeight, picWidth, picHeight);
              listHeight += height / onVerNumber;
              listWidth += width / oneLineNumber;
            }
          }
          callbackFunc();
        };
        const callbackFunc = () => {
          if (loadingPicNumber !== needPicNumber) return false;
          const imgUrl = canvas.toDataURL('image/png');
          resolve(imgUrl);
        };
        bottomImg.src = require('@/assets/images/share_bottom_bg.jpg');
        waterImg.src = require('@/assets/images/share_water_bg.png');
      });
    });
  }
}

export default new VueFunc();
