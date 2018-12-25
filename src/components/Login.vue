<template>
  <div class="full">
    <Header></Header>
    <div class="main">
      <div class="input-box">
        <p class="title">登录</p>
        <input v-model="mail" class="input" type="text" placeholder="邮箱">
        <input v-model="password" class="input" type="password" placeholder="密码">
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
            <input @keypress.enter="login" v-model="answer" class="answer" type="text">
          </span>
          <a class="btn_01" @click="login">登录</a>
        </p>
        <p class="small-text">
          <router-link to="/forget">忘记密码？</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "./Header.vue";
import Config from "../config.js";

export default {
  name: "Login",
  components: {
    Header
  },
  created: function() {
    if (sessionStorage.getItem("auth")) {
      this.$router.push("today");
    }
  },
  mounted: function() {
    this.loadVerificationCode();
  },
  data: function() {
    return {
      id: false,
      mail: "",
      password: "",
      answer: "",
      message: [0, ""],
      Config: Config
    };
  },

  methods: {
    // 准备数据
    login: function() {
      let postData = {
        mail: this.mail,
        password: this.password,
        timestamp: new Date().getTime(),
        id: this.id,
        answer: this.answer
      };
      // 校验
      let is_correct_mail = postData.mail.match(/\w+@\w+\.\w+/g);
      if (!is_correct_mail) {
        this.$push_message({ text: "邮箱格式不正确", duration: 2000 });
        return false;
      } else if (postData.password.length < 3) {
        this.$push_message({ text: "密码长度须大于3", duration: 2000 });
        return false;
      } else if (postData.answer.length < 1) {
        this.$push_message({ text: "验证码不能为空", duration: 2000 });
        return false;
      } else {
        // console.log(postData);
        let url = Config.API.gateway + Config.API.login;
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
              this.$push_message({ text: res.message, duration: 2000 });
              this.answer = "";
              this.loadVerificationCode();
            } else {
              // 记录密钥
              sessionStorage.setItem("auth", res.data.auth);
              // 跳转
              this.$router.push("/today");
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
          } else {
            this.$push_message({ text: "请求验证码失败", duration: 2000 });
            this.message = [2, ""];
          }
        });
    }
  }
};
</script>

<style>
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
  font-size: 20px;
  text-align: center;
}

.input {
  margin: 0;
  padding: 5px;
  font-size: 1rem;
  margin-bottom: 8px;
  border: 1px solid rgba(45, 45, 45, 0.5);
  border-radius: 0;
  width: 100%;
  outline: none;
}

.check {
  position: relative;
  margin: 0;
  height: 25px;
}

.question {
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 63px;
  height: 25px;
}

.question img {
  height: 25px;
}

.answer {
  position: absolute;
  top: 0;
  left: 68px;
  width: 35px;
  height: 30px;

  font-size: 15px;
  text-align: center;
  padding: 2.5px;
  outline: none;
  border: none;
  border-radius: 0;
  background-color: transparent;
  border-bottom: 1px solid rgba(45, 45, 45, 0.2);
}

.btn_01 {
  position: absolute;
  top: 0;
  right: 0;
  width: 40px;
  height: 25px;

  margin: 0;
  padding: 0 2.5px;
  font-size: 15px;
  border: 1px solid rgba(45, 45, 45, 0.5);
  cursor: pointer;
  text-align: center;
}

.small-text {
  border-top: 1px solid rgba(45, 45, 45, 0.2);
  padding: 5px;
  margin-top: 16px;
  text-align: center;
}
.small-text a {
  font-size: 12px;
  color: rgba(45, 45, 45, 0.5);
}
</style>
