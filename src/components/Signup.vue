<template>
  <div class="full">
    <Header></Header>
    <div class="main">
      <p v-if="notice" class="notice">{{notice}}</p>
      <div class="input-box">
        <p class="title">注册</p>
        <input v-model="mail" class="input" type="text" placeholder="邮箱">
        <input v-model="password" class="input" type="password" placeholder="密码">
        <input v-model="password2" class="input" type="password" placeholder="重复密码">
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
          <span class="btn">
            <p @click="login">注册</p>
          </span>
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
  mounted: function() {
    this.loadVerificationCode();
  },
  data: function() {
    return {
      id: "",
      mail: "",
      password: "",
      password2: "",
      answer: "",
      notice: "",
      Config: Config
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
      }, 1000);
    }
  },
  methods: {
    login: function() {
      // 准备注册所需数据
      let postData = {
        mail: this.mail,
        password: this.password,
        timestamp: new Date().getTime(),
        id: this.id,
        answer: this.answer
      };
      // 校验数据
      let is_correct_mail = postData.mail.match(/\w+@\w+\.\w+/g);
      if (!is_correct_mail) {
        this.notice = "邮箱格式不正确喔。";
        return false;
      } else if (postData.password.length < 3) {
        this.notice = "密码长度须大于叁。";
        return false;
      } else if (postData.answer.length < 1) {
        this.notice = "验证码不能为空。";
        return false;
      } else if (this.password != this.password2) {
        this.notice = "两次密码不一致";
        return false;
      } else {
        // 开始请求服务器
        let url = Config.API.gateway + Config.API.signup;
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
              this.notice = '注册成功，即将重定向至登录页面。';
              setTimeout(()=>{
                this.$router.push('/login');
              },1500)
            }
          });
      }
    },
    loadVerificationCode: function() {
      fetch(Config.API.gateway + Config.API.get_verification_code)
        .then(res => res.json())
        .then(res => {
          if (res.ok) {
            this.question = res.data.question;
            this.id = res.data.id;
          }else{
            this.notice = '请求验证码失败。';
          }
        });
    }
  }
};
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

.notice {
  position: absolute;
  text-align: center;
  width: 100%;
  height: 50px;
  top: 5px;
  padding: 0.5rem;
  margin: 0;
  color: #cc5229;
}

.input-box {
  position: absolute;
  width: 300px;
  height: 250px;
  top: 50%;
  right: 50%;
  margin-top: -125px;
  margin-right: -150px;
  padding: 0.5rem;
}

.input-box .title {
  margin: 0;
  padding: 0.5rem;
  font-size: 1.2rem;
  text-align: center;
}

.input {
  margin: 0;
  padding: 0.5rem;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  width: 100%;
  outline: none;
}

.check {
  margin: 0;
  padding: 0 .2rem;
  line-height: 25px;
  height: 25px;
}


.question {
  margin: 0;
  display: inline-block;
  padding: 0 5px;
}

.question img {
  height: 25px;
}

.answer {
  margin-left: 0.2rem;
  padding: 0.2rem;
  font-size: 1rem;
  text-align: center;
  width: 10%;
  outline: none;
  border: none;
  background-color: transparent;
  border-bottom: 1px solid rgba(45, 45, 45, 0.98);
}

.btn {
  float: right;
  height: 25px;
}

.btn p {
  height: 25px;
  margin: 0;padding: 0 5px;
  display: inline-block;
  border: 1px solid rgba(45, 45, 45, 0.98);
  cursor: pointer;
}
</style>
