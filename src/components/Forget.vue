<template>
  <div class="full">
    <Header></Header>
    <div class="main">
      <p v-if="notice" class="notice">{{notice}}</p>
      <div class="input-box">
        <p class="title">
          <span>找回密码</span>
          <!-- <span class="small-text">
            <router-link to="/login">登录</router-link>
          </span> -->
        </p>
        <input v-model="mail" class="input" type="text" placeholder="邮箱">
        <div v-if="sended">
          <input v-model="code" class="input" type="text" placeholder="校验码">
          <input v-model="password" class="input" type="password" placeholder="新密码">
          <input v-model="password2" class="input" type="password" placeholder="重复新密码">
        </div>

        <p class="check">
          <span v-if="!id">
            <p class="question">
              <img src="../assets/wait.gif">
            </p>
          </span>
          <span v-if="id">
            <p class="question">
              <img :src="Config.API.gateway+Config.API.get_verification_img+id">
            </p>
            <input v-model="answer" class="answer" type="text">
          </span>
          <a class="btn_01" @click="request">继续</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "./Header.vue";
import Config from "../config.js";
export default {
  name: "Signup",
  components: {
    Header
  },
  beforeMount:function(){
    if(this.$route.query.mail&&this.$route.query.code){
      this.code = this.$route.query.code;
      this.mail = this.$route.query.mail;
      this.sended = true;
    }

  },
  mounted: function() {
    this.loadVerificationCode();
    
  },
  data: function() {
    return {
      id: "",
      mail: "",
      code:"",
      password: "",
      password2: "",
      answer: "",
      notice: "",
      Config: Config,
      sended: false
    };
  },
  watch: {

    password: function() {
      if (this.password != this.password2) {
        this.notice = "两次密码不一致";
      } else {
        this.notice = "";
      }
    },
    password2: function() {
      if (this.password != this.password2) {
        this.notice = "两次密码不一致";
      } else {
        this.notice = "";
      }
    },
    notice: function() {
      setTimeout(() => {
        this.notice = "";
      }, 1500);
    }
  },
  methods: {
    request: function() {
      // 准备所需数据
      let postData = {
        mail: this.mail,
        password: this.password,
        code:this.code,
        timestamp: new Date().getTime(),
        id: this.id,
        answer: this.answer,
        notice:''
      };

      // 校验数据
      let is_correct_mail = postData.mail.match(/\w+@\w+\.\w+/g);
      if (!is_correct_mail) {
        this.notice = "邮箱格式不正确。";
        return false;
      } else if (postData.answer.length < 1) {
        this.notice = "验证码不能为空。";
        return false;
      }

      if (this.sended) {
        if (postData.password.length < 3) {
          this.notice = "密码长度须大于3。";
          return false;
        } else if (this.password != this.password2) {
          this.notice = "两次密码不一致";
          return false;
        }
      }

      let url;
      if (this.sended) {
        url = Config.API.gateway + Config.API.reset_password;
      }else{
        url = Config.API.gateway + Config.API.get_password_reset_code;
      }
      // 开始请求服务器
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
            // 返回错误信息并重新请求验证码
            this.notice = res.message;
            this.loadVerificationCode();
          } else {
            // 跳转
            if(!this.sended){
              this.notice = "一个用来重置密码的链接以经发送到你的邮箱。";
            }else{
              this.notice = '重置成功，即将重定向到登录页面。';
              setTimeout(()=>{
                this.$router.push('/login');
              },1500)
            }
            
          }
        });
    },
    loadVerificationCode: function() {
      fetch(Config.API.gateway + Config.API.get_verification_code)
        .then(res => res.json())
        .then(res => {
          if (res.ok) {
            this.question = res.data.question;
            this.id = res.data.id;
          } else {
            this.notice = "请求验证码失败。";
          }
        });
    }
  }
};
</script>

<style scoped>

</style>
