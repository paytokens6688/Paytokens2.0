# store的各种注释

- back_page 头部传值方式
    ``` javascript
      //  传字符串类型
      this.$store.commit('layout/backPageChange', '不好');
      // 或者传对象类型
      this.$store.commit('layout/backPageChange', {
        // 标题
        title: '',
        // 底部阴影是否添加
        shadown: false
      });
    ```
