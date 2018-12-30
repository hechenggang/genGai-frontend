<template>
  <div class="full">
    <FuncBar></FuncBar>
    <div class="main">
      <div class="today">
        <p class="date">今天是{{date}}，</p>
        <textarea v-model="content" @keypress.enter="save" class="content" rows="10"></textarea>
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
  created: function() {
    if (!this.get_auth()) {
      this.$router.push("/login");
    }
  },
  mounted: function() {
    this.load();
    this.get_date();
  },
  data: function() {
    return {
      date: "",
      content: "",
      funcs: [
        { name: "今天", target: "/today" },
        { name: "历史", target: "/history" }
      ],
      count: 0,
    };
  },

  computed: {
    codeCount: function() {
      return this.content.length;
    }
  },
  methods: {
    // 准备数据
    load: function() {
      let auth = this.get_auth();
      let postData = { auth };
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
            this.content = "";
          } else {
            // 跳转
            this.today = true;
            this.content = res.data.content;
          }
        });
    },
    // 提交数据
    save: function() {
      let postData = {
        auth: this.get_auth(),
        content: this.content
      };

      if (postData.content.length < 1) {
        this.$push_message({ text: "不能提交空内容", duration: 2000 });
        return false;
      } else {
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
              this.$push_message({
                text: "保存失败，" + res.message,
                duration: 2000
              });
            } else {
              this.$push_message({ text: "保存成功", duration: 2000 });
            }
          });
      }
    },
    get_auth: function() {
      let auth = sessionStorage.getItem("auth");
      if (auth) {
        return auth;
      }
      return false;
    },
    get_date: function() {
      let date = new Date();
      let year = date.getFullYear();
      let month = Number.parseInt(date.getMonth())+1;
      let day = date.getDate();
      this.date = year + "年" + month + "月" + day + "日";
    },
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
@media screen and (max-width: 720px) {
  .today {
    padding: 10px;
  }
}

.content {
  width: 100%;
  padding: 7.5px;
  border-radius: 0;
  /* border: 1px solid rgba(45, 45, 45, 0.98); */
  background-color: transparent;
  box-shadow: 0 0 5px rgba(145, 145, 145, 0.5);
  border: none;
}

.btn,
.count {
  margin: 0.5rem 0;
  display: inline-block;
  padding: 0 0.5rem;
  border: none;
  box-shadow: 0 0 5px rgba(145, 145, 145, 0.5);
  color: rgb(145, 145, 145);
  cursor: pointer;
}

.count {
  float: right;
}

.notice-today {
  color: #cc5229;
}

.date {
  margin: 0;
  padding: 7.5px;
}
</style>
