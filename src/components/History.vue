<template>
  <div class="full">
    <FuncBar></FuncBar>
    <div class="main">
      <ul class="history">
        
        <li v-for="day in history" class="day" :key="day[0]">
          <p class="date">
            <span>{{get_date(day[1])[0]}}-</span>
            <span>{{get_date(day[1])[1]}}-</span>
            <span>{{get_date(day[1])[2]}}</span>
          </p>
          <p class="text">{{day[2]}}</p>
        </li>
        <p class="center-text">已经为自己记录了 {{history.length}} 天，加油！</p>

      </ul>
    </div>
  </div>
</template>

<script>
import FuncBar from "./FuncBar.vue";
import Config from "../config.js";
export default {
  name: "History",
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
  },
  data: function() {
    return {
      history: [],
      message: [0, ""],
    };
  },

  methods: {
    // 准备数据
    load: function() {
      let auth = this.get_auth();
      let postData = { auth };
      let url = Config.API.gateway + Config.API.history;
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
            this.$push_message({text:'没有找到历史纪录',duration:2000});
          } else {
            // 跳转
            this.history = res.data.history;
          }
        });
    },

    get_auth: function() {
      let auth = sessionStorage.getItem("auth");
      if (auth) {
        return auth;
      }
      return false;
    },
    get_date: function(timestamp = false) {
      let date = new Date();
      if (timestamp) {
        date = new Date(timestamp);
      }
      let year = date.getFullYear();
      let month = Number.parseInt(date.getMonth())+1;
      let day = date.getDate();
      return [year, month, day];
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

.history {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 50px;
  margin: 0;
  overflow-y: auto;
}
@media screen and (max-width: 720px) {
  .history {
    padding: 7.5px;
  }
}
.day {
  position: relative;
  list-style: none;
  margin-bottom: 15px;
  padding: 10px;
  box-shadow: 0 0 5px rgba(145, 145, 145, 0.5);
}

.text {
  margin: 0;
  color: rgba(12, 12, 12, 0.8);
}

.date {
  color: rgba(12, 12, 12, 0.5);
  margin: 0;
}

.date span {
  font-size: 13px;
}
.center-text {
  text-align: center;
  font-size: .9rem;
  color: #ccc;
}
</style>
