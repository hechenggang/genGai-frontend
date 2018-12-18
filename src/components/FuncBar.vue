<template>
  <ul class="funcs">
    <li class="func" v-for="func in funcs" :key="func.target">
      <router-link :to="func.target">{{func.name}}</router-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: "Header",
  data: function() {
    return {
      funcs:[
        {name:'今日',target:'/today'},
        {name:'往日',target:'/history'}
      ],
    };
  }
};
</script>

<style scoped>
.funcs {
  position: fixed;
  top: 0;
  left: 0;
  width: 50px;
  bottom: 0;

  padding: 0;
  margin: 0;

  background-color: rgba(45,45,45,0.98);

  box-shadow: 0 0 5px rgba(145, 145, 145, 0.5);
}
.func  {
  display: table;
  width: 50px;
  height: 50px;
  list-style: none;
}
.func a{
  display: table-cell;
  text-align: center;
  vertical-align: middle;

  text-decoration: none;
  outline: none;
  color: #fdfdfd;
}

.router-link-exact-active {
    background-color: rgba(116, 116, 116, 0.48);
    color: rgba(45,45,45,0.98);
  }

</style>
