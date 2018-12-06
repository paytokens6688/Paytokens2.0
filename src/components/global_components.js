import globalComponents from './global_components.vue';

const GlobalComponents = {};

GlobalComponents.install = function (Vue) {
  // 生成一个Vue的子类
  // 同时这个子类也就是组件
  const GlobalComponentsConstructor = Vue.extend(globalComponents);
  // 生成一个该子类的实例
  let instance = new GlobalComponentsConstructor();
  // 创建一个div进行挂载
  instance.$mount(document.createElement('div'));
  // 将挂载节点添加到页面内
  document.body.appendChild(instance.$el);
  // 通过Vue的原型注册一个方法
  // 让所有实例共享这个方法
  Vue.prototype.$global = {
    // 警告事件
    alertOptions (arg) {
      if (arg === false) {
        instance.alertOptions = {
          show: false
        };
        return false;
      }
      let options = {};
      if (typeof arg === 'string') {
        options.message = arg;
        options.callbackList = [
          {
            title: '知道了',
            callback () {}
          }
        ];
      } else {
        options = arg;
      }
      options = {
        show: true,
        noClose: false,
        ...options
      };
      instance.alertOptions = options;
    },
    // 成功事件
    successOptions (arg) {
      if (arg === false) {
        instance.successOptions = {
          show: false
        };
        return false;
      }
      let options = {};
      if (typeof arg === 'string') {
        options.message = arg;
      } else {
        options = arg;
      }
      options = {
        show: true,
        ...options
      };
      instance.successOptions = options;
    },
    // 暂未开放事件
    notOpenOptions () {
      instance.notOpenOptions = {
        show: true
      };
    },
    // loading
    loadingOptions (arg) {
      if (arg === false) {
        instance.loadingOptions = {
          show: false
        };
        return false;
      } else if (arg === true) {
        instance.loadingOptions = {
          show: true
        };
        return true;
      }
      let options = {};
      if (typeof arg === 'object') {
        options = arg;
      }
      options = {
        show: true,
        ...options
      };
      instance.loadingOptions = options;
    }
  };
};

export default GlobalComponents;
