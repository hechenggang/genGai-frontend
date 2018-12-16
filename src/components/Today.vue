<template>
  <div class="full">
    <FuncBar></FuncBar>
    <div class="main">
      
      <div class="today">
        <p v-if="notice" class="notice">{{notice}}</p>
        <p class="date">今天是{{date}}，</p>
        <textarea v-model="content" class="content" rows="10"></textarea>
        <p class="btn" @click="save">保存</p>
        <p class="count">{{codeCount}}/200字</p>

      </div>
    </div>
  </div>
</template>

<script>
import FuncBar from "./FuncBar.vue";
import Config from "../config.js";
export default {
  name: "Today",
  components: {
    FuncBar
  },
  created:function(){
    if(!this.get_auth()){
      this.$router.push('/login');
    }
  },
  mounted: function() {
    this.load();
    this.get_date();
  },
  data: function() {
    return {
      date:'',
      notice: '',
      content: '',
      funcs:[
        {name:'今天',target:'/today'},
        {name:'历史',target:'/history'}
      ],
      count:0,
    };
  },
  watch: {
    notice: function() {
      setTimeout(() => {
        this.notice = "";
      }, 1500);
    }
  },
  computed:{
    codeCount:function(){
      return this.content.length
    }
  },
  methods: {
    // 准备数据
    load: function() {
      let auth = this.get_auth()
      let postData = {auth};
      let url = Config.API.gateway + Config.API.today;
      fetch(url, {
        method: "post",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(postData)
      })
        .then(res => res.json())
        .then(res => {
          if (!res.ok) {
            this.today = false;
            this.content = '';
          } else {
            // 跳转
            this.today = true;
            this.content = res.data.content;
          }
        })
    },
    // 提交数据
    save: function() {
      let postData = {
        auth: this.get_auth(),
        content: this.content
      };
      
      if (postData.content.length < 1) {
        this.notice = "不能提交空内容。";
        return false;
      }  else {
        let url = Config.API.gateway + Config.API.save;
        fetch(url, {
          method: "post",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(postData)
        })
          .then(res => res.json())
          .then(res => {
            if (!res.ok) {
              this.notice = '保存失败，'+res.message;
            } else {
              // 跳转
              this.notice = '保存成功。';
            }
          });
      }
    },
    get_auth:function(){
      let auth = sessionStorage.getItem('auth');
      if (auth){
        return auth
      }
      return false
    },
    get_date:function(){
      let date = new Date();
      let year = Array.from(String(date.getFullYear())).map(num=>{
        return this.to_chinese(num);
      }).join('') ;
      let month = Array.from(String(date.getMonth())).map((num,index,array)=>{
        return this.to_chinese(num,index,array);
      }).join('') ;
      let day = Array.from(String(date.getDate())).map((num,index,array)=>{
        return this.to_chinese(num,index,array);
      }).join('') ;
      this.date = (year+'年'+month+'月'+day+'日');
    },
    to_chinese:function(num,index=false,array=false){
      if(array.length == 2 && index == 0){
        num = '10';
      }
      // let dic = {
      //   '0':'零',
      //   '1':'壹',
      //   '2':'贰',
      //   '3':'叁',
      //   '4':'肆',
      //   '5':'伍',
      //   '6':'陆',
      //   '7':'柒',
      //   '8':'捌',
      //   '9':'玖',
      //   '10':'拾'
      // }
      let dic = {
        '0':'零',
        '1':'一',
        '2':'二',
        '3':'三',
        '4':'四',
        '5':'五',
        '6':'六',
        '7':'七',
        '8':'八',
        '9':'九',
        '10':'十'
      }
      return dic[num]
    }
  }
};
</script>

<style scoped>


.main {
  position: fixed;
  top: 0;
  left: 50px;
  right: 0;
  bottom: 0;

  padding: 0;
  margin: 0;
}

.today {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 50px;
  margin: 0;
}

.content {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
}

.btn,.count {
  margin: .5rem 0;
  display: inline-block;
  padding: 0 0.2rem;
  border: 1px solid rgba(45, 45, 45, 0.98);
  cursor: pointer;
}

.count {
  float: right;
}

.notice {
  color: #cc5229;
}

.date {
  margin: .5rem 0;
  font-size: 1rem;
}
</style>
