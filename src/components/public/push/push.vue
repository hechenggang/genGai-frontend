<template>
  <transition name="slide-fade">
    <div v-if="show" class="mess-bar">
      <div class="mess-back">
        <p class="mess-text">{{text}}</p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data: function() {
    return {
      text: "",
      show: false,
    };
  },
  watch: {
    text: function() {
      this.display();
    }
  },
  methods: {
    display: function() {
      if (this.text.length > 0) {
        // 第一步，显示组件
        this.show = true;
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
