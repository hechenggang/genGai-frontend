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
      history: []
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
            console("获取历史纪录失败");
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
      let month = date.getMonth();
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
@media screen and (max-width: 720px){
  .history {
    padding: 10px;
  }
}
.day {
  position: relative;
  list-style: none;
  margin: 1rem 0;
  padding-top: 1rem;
  border-top: 1px solid rgba(12, 12, 12, .5);
}

.text {
  margin: 0;
  color: rgba(12, 12, 12, .8);
}

.date {
  color: rgba(12, 12, 12, .5);
  font-size: 0.8rem;
  margin: 0;
  margin-bottom: .2rem; 
}
</style>
