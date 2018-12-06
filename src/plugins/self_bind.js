// 自定义指令绑定
import Vue from 'vue';
import Hammer from 'hammerjs';

// 左滑事件
Vue.directive('goLeft', {
  hummer: '',
  // 当被绑定的元素插入到 DOM 中时……
  inserted: (el, ref) => {
    if ((typeof ref.value) !== 'function') {
      return console.error(Error('绑定元素的内容不是一个函数'));
    }
    const hammer = new Hammer(el);
    hammer.on('swipeleft', (event) => {
      ref.value(event);
    });
    ref.def.hummer = hammer;
  }
});

// 右滑事件
Vue.directive('goRight', {
  hummer: '',
  // 当被绑定的元素插入到 DOM 中时……
  inserted: (el, ref) => {
    if ((typeof ref.value) !== 'function') {
      return console.error(Error('绑定元素的内容不是一个函数'));
    }
    const hammer = new Hammer(el);
    hammer.on('swiperight', (event) => {
      ref.value(event);
    });
    ref.def.hummer = hammer;
  }
});
