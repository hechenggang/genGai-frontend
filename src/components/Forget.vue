<template>
  <div class="full">
    <Header></Header>
    <div class="main">
      <div class="input-box">
        <p class="title">找回密码</p>
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
            <input @keypress.enter="request" v-model="answer" class="answer" type="text">
          </span>
          <a class="btn_01" @click="request">{{btn_text}}</a>
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
  beforeMount: function() {
    if (this.$route.query.mail && this.$route.query.code) {
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
      code: "",
      password: "",
      password2: "",
      answer: "",
      Config: Config,
      sended: false,
      btn_text: "继续"
    };
  },
  watch: {
    password: function() {
      if (this.password != this.password2) {
        this.$push_message({ text: "两次密码不一致", duration: 1000 });
      }
    },
    password2: function() {
      if (this.password != this.password2) {
        this.$push_message({ text: "两次密码不一致", duration: 1000 });
      }
    }
  },
  methods: {
    request: function() {
      // 准备所需数据
      let postData = {
        mail: this.mail,
        password: this.password,
        code: this.code,
        timestamp: new Date().getTime(),
        id: this.id,
        answer: this.answer,
        notice: ""
      };

      // 校验数据
      let is_correct_mail = postData.mail.match(/\w+@\w+\.\w+/g);
      if (!is_correct_mail) {
        this.$push_message({ text: "邮箱格式不正确", duration: 2000 });
        return false;
      } else if (postData.answer.length < 1) {
        this.$push_message({ text: "验证码不能为空", duration: 2000 });
        return false;
      }

      if (this.sended) {
        if (postData.password.length < 4) {
          this.$push_message({ text: "密码长度须大于3", duration: 2000 });
          return false;
        } else if (this.password != this.password2) {
          this.$push_message({ text: "两次密码不一致", duration: 2000 });
          return false;
        }
      }

      let url;
      if (this.sended) {
        url = Config.API.gateway + Config.API.reset_password;
      } else {
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
            this.$push_message({ text: res.message, duration: 2000 });
            this.loadVerificationCode();
            this.answer = "";
          } else {
            // 跳转
            if (!this.sended) {
              this.$push_message({ text: "重置邮件已发送", duration: 2000 });
              this.loadVerificationCode();
              this.btn_text = "重试";
              this.answer = '';
            } else {
              this.$push_message({
                text: "重置成功，即将跳转",
                duration: 2000
              });
              setTimeout(() => {
                this.$router.push("/login");
              }, 1500);
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
            this.$push_message({ text: "请求验证码失败", duration: 2000 });
          }
        });
    }
  }
};
</script>

<style scoped>
</style>
