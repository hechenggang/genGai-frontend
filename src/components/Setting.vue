<template>
  <div class="full">
    <FuncBar></FuncBar>
    <div class="main">
      <div class="setting">
        <p class="date">日记设置</p>
        <div class="btns">
          <p class="btn" @click="dn_history">导出</p>
          <div class="btns">
            <p class="btn" @click="read_json">导入</p>
            <input id="input-history" type="file">
          </div>
        </div>
        <p class="date">账户设置</p>
        <div class="btns">
          <p class="btn warning" @click="user_clean">停用</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FuncBar from "./FuncBar.vue";
import Config from "../config.js";
export default {
  name: "Setting",
  components: {
    FuncBar
  },
  created: function() {},
  mounted: function() {},
  data: function() {
    return {};
  },

  methods: {
    dn_history: function() {
      let auth = sessionStorage.getItem("auth");
      let link = Config.API.gateway + Config.API.download_history_json + auth;
      window.location.assign(link);
    },
    read_json: function() {
      let file = document.querySelector("#input-history").files[0];
      if (!file) {
        this.$push_message({ text: "请先选择一个备份文件", duration: 2000 });
      }

      if (/json/.test(file.type)) {
        let reader = new FileReader();
        let push = this.$push_message;
        let update_history = this.update_history;
        reader.onload = function() {
          let data = false;
          try {
            data = JSON.parse(this.result);
          } catch (e) {}

          if (!data) {
            push({ text: "备份文件校验失败", duration: 2000 });
          }
          for (let i = 0; i < data.length; i++) {
            if (
              !(
                data[i].length == 3 &&
                data[i][0].length == 32 &&
                String(data[i][1]).length == 13
              )
            ) {
              push({ text: "备份文件校验失败", duration: 2000 });
              return false;
            }
          }
          update_history(data);
        };
        reader.readAsText(file);
      }
    },
    update_history: function(data) {
      let confi = confirm(
        `该备份包含 ${data.length} 条记录，重复项将会被忽略，确认导入吗？`
      );
      if (!confi) {
        this.$push_message({ text: "导入终止", duration: 2000 });
      } else {
        // 导入
        let postData = {
          auth: this.get_auth(),
          history: data
        };

        let url = Config.API.gateway + Config.API.upload_history_json;
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
                text: "导入失败，" + res.message,
                duration: 2000
              });
            } else {
              this.$push_message({ text: "导入成功", duration: 2000 });
            }
          });
      }
    },
    user_clean: function() {
      let auth = sessionStorage.getItem("auth");
      let link = Config.API.gateway + Config.API.user_clean + auth;
      let confi = confirm("确定要停用账户吗？\n你的所有的资料都将被删除且不能恢复。");
      if (confi) {
        fetch(link)
          .then(res => res.json())
          .then(res => {
            this.$push_message({ text: res.message, duration: 2000 });
            setTimeout(()=>{
              sessionStorage.clear();
              location.assign('./#/');
            },2000)
          });
      } else {
        this.$push_message({ text: "停用终止", duration: 2000 });
      }
    },

    get_auth: function() {
      let auth = sessionStorage.getItem("auth");
      if (auth) {
        return auth;
      }
      return false;
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
.setting {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 50px;
  margin: 0;
}
@media screen and (max-width: 720px) {
  .setting {
    padding: 10px;
  }
}

.btn {
  display: inline-block;
  margin: 0;
  margin-right: 0.25rem;
  margin-bottom: 0.25rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid rgba(145, 145, 145, 0.5);
  cursor: pointer;
}

.warning {
  background-color: rgba(255, 61, 61, 0.884);
  color: #fffffd;
}

#input-history {
}
</style>
