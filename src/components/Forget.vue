<template>
  <div class="full">
    <Header></Header>
    <div class="main">
      <div class="input-box">
        <p class="title">
          <span>找回密码</span>
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
    <Message :message="message"></Message>
  </div>
</template>

<script>
import Header from "./Header.vue";
import Config from "../config.js";
import Message from './Message.vue';
export default {
  name: "Signup",
  components: {
    Header,
    Message
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
      message:[0,''],
      Config: Config,
      sended: false
    };
  },
  watch: {

    password: function() {
      if (this.password != this.password2) {
        this.message = [2,'两次密码不一致'];
      } 
    },
    password2: function() {
      if (this.password != this.password2) {
        this.message = [2,'两次密码不一致'];
      } 
    },
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
        this.message = [2,'邮箱格式不正确'];
        return false;
      } else if (postData.answer.length < 1) {
        this.message = [2,'验证码不能为空'];
        return false;
      }

      if (this.sended) {
        if (postData.password.length < 4) {
          this.message = [2,'密码长度须大于3'];
          return false;
        } else if (this.password != this.password2) {
          this.message = [2,'两次密码不一致'];
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
            this.message = [2,res.message];
            this.loadVerificationCode();
          } else {
            // 跳转
            if(!this.sended){
              this.message = [2,'重置邮件已发送'];
            }else{
              this.message = [2,'重置成功，即将跳转'];
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
            this.message = [2,'请求验证码失败'];
          }
        });
    }
  }
};
</script>

<style scoped>

</style>
