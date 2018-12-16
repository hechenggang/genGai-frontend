<template>
  <ul class="header">
    <li class="header-item" v-for="item in items" :key="item.target">
      <router-link :to="item.target">{{item.name}}</router-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Header',
  data:function(){
    return {
      items:[
        {name:'首页',target:'/'},
        {name:'登录',target:'/login'},
        {name:'注册',target:'/signup'}
      ]
    }
  }
}
</script>

<style scoped>

  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
    background-color: rgba(45,45,45,0.98);

    list-style: none;
    padding: 0;
    margin: 0;
  }

  .header-item {
    display: inline-block;
  }

  .header-item a {
    display: inline-block;
    line-height: 30px;
    padding: 10px;
    text-decoration: none;
    outline: none;
    color: #fdfdfd;
  }

  .router-link-exact-active {
    background-color: rgba(116, 116, 116, 0.48);
    color: rgba(45,45,45,0.98);
  }

  
</style>
