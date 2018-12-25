<template>
  <transition name="slide-fade">
    <div v-if="!close" class="mess-bar">
      <div v-if="!close" class="mess-back">
        <p class="mess-text">{{message[1]}}</p>
        <p class="mess-mask" :style="mask_style"></p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    message: Array
  },
  name: "Message",
  data: function() {
    return {
      close: true,
      mask_style: "",
      mask_width: 200,
      loop: ""
    };
  },
  mounted: function() {
    this.check();
  },
  watch: {
    message: function() {
      this.check();
    },
    mask_width: function() {
      this.mask_style = `width:${this.mask_width}px;`;
      if (this.mask_width < 0) {
        // console.log('结束循环');
        clearInterval(this.loop);
        this.mask_width = 200;
        this.close = true;
      }
    }
  },
  methods: {
    check: function() {
      if (this.message[0]) {
        // 检查残留
        if (this.loop) {
          clearInterval(this.loop);
        }
        // 开启弹窗
        this.close = false;
        // 开始控制进度条
        this.loop = setInterval(() => {
          this.mask_width -= 1;
          // console.log('正在减少宽度');
        }, (1000 / this.mask_width) * this.message[0]);
      } else {
        this.close = true;
      }
    }
  }
};
</script>

<style scoped>
.mess-bar {
  position: fixed;
  right: 10px;
  bottom: 10px;
  width: 200px;
  height: 50px;
  padding: 0;
  margin: 0;
}

.mess-back,
.mess-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200px;
  padding: 0;
  margin: 0;
  background-color: rgba(45, 45, 45, 0.65);
}

.mess-back {
  height: 50px;
}
.mess-mask {
  height: 5px;
}

.mess-text {
  text-align: center;
  margin: 0;
  line-height: 50px;
  color: rgba(255, 255, 255, 0.8);
}

.slide-fade-enter-active {
  transition: all 0.35s ease;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
