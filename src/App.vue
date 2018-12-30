<template>
<div id="app">
  <router-view></router-view>  
</div>

</template>

<script>
export default {
  name: 'app',
  
}
</script>

<style>

* {
  box-sizing: border-box;
  font-size: 16px;
}
body {
  margin: 0;
  padding: 0;
  background-color: #f5f6f7;
  font-family: "SF Pro SC","SF Pro Text","SF Pro Icons","PingFang SC","Helvetica Neue","Helvetica","Arial",sans-serif;
}
a {
  text-decoration: none;
  color: rgba(32, 6, 6, 0.95);
}
</style>
