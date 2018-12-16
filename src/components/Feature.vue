<template>
  <div class="full">
    <Header></Header>
    <div class="main">
      <div class="center-box">
        <p class="center-box-child">{{slogen}}</p>
      </div>
    </div>
    
  </div>
</template>

<script>
import Header from './Header.vue'

export default {
  name: 'Feature',
  components: {
    Header
  },
  beforeMount:function(){
    this.swichSlogen();
    setInterval(()=>{
      this.swichSlogen();
    },2500)
  },
  data:function(){
    return {
      slogen:'',
      slogenIndex:0,
      slogens:[
          '一句话，记录一整天',
          '简洁而不失细节的设计',
          '只有自己能看到',
          '仅能修改今天',
          '从今天开始',
          '留下每一天的精彩'
        ]
    }
  },
  methods:{
    swichSlogen:function(){
      if (!(this.slogenIndex < this.slogens.length)){
        this.slogenIndex = 0;
      }
      this.slogen = this.slogens[this.slogenIndex];
      this.slogenIndex += 1;
    }
  }
}

</script>

<style scoped>
.main {
    position: fixed;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;

    padding: 0;
    margin: 0;
  }

  .center-box {
    position: absolute;
    width: 100%;
    height: 100%;
    display: table;
  }

  .center-box-child {
    text-align: center;
    vertical-align: middle;
    display: table-cell;

    font-size: 1.5rem;
    font-weight: bold;
  }
</style>
