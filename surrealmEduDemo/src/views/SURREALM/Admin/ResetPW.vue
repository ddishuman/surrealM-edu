<template>
  <div id="ResetPW" class="admin-reset-pw">
    <div class="reset-area">
      <img src="@/assets/img/SURREALM/Admin/logo_2.png" class="reset-logo" />
      <div class="reset-keyin-area">
        <h2 class="reset-title">重設密碼</h2>
        <form>
          <div class="reset-desc">密碼</div>
          <input class="reset-input" v-model.trim="Password" type="password" placeholder="輸入密碼" autocomplete="on" />
          <div class="reset-desc">再次確認密碼</div>
          <input
            class="reset-input"
            v-model.trim="PasswordAgain"
            type="password"
            placeholder="輸入密碼"
            autocomplete="on"
          />
        </form>

        <button class="reset-btn-left" @click="BackLogin()">返回登入頁</button>
        <button class="reset-btn-right" @click="ResetPW()">送出</button>
      </div>
    </div>
    <DialogMsgMaintain />
  </div>
</template>

<script>
import DialogMsgMaintain from '@/components/SURREALM/Backend/DialogMsgMaintain.vue';
import { apiAdminResetPW } from '@/request.js';
import sha256 from 'sha256';

export default {
  data() {
    return {
      QueryString: {
        Serial: '',
        Email: '',
      },
      Password: '',
      PasswordAgain: '',
    };
  },
  mounted() {
    this.QueryString.Serial = this.GetParameterByName('s');
    this.QueryString.Email = this.GetParameterByName('e');
    if (this.QueryString.Serial == null && this.QueryString.Email == null) {
      this.$router.push({ path: '/SURREALM/Admin/Login' });
    }
  },
  methods: {
    ResetPW() {
      let ChkErr = '';
      if (this.Password.trim() == '' || this.PasswordAgain.trim() == '') {
        ChkErr = '請輸入密碼';
      } else if (this.Password.trim() != this.PasswordAgain.trim()) {
        ChkErr = '密碼與確認密碼不同, 請重新輸入';
      }

      if (ChkErr == '') {
        let data = {
          PW: sha256(this.Password.trim()),
          Serial: Number(this.QueryString.Serial),
        };
        apiAdminResetPW(data, this.QueryString.Email).then((res) => {
          if (res.data.Status == 'ok') {
            this.$toasted.show('密碼已修改完成', {
              icon: 'warning',
              position: 'bottom-center',
              duration: 3500,
            });
            this.$router.push({ path: '/SURREALM/Admin/Login' });
          } else {
            this.$toasted.show(this.$t('SURREALM.ApiErr') + `${res.data.Code}, ${res.data.Error}`, {
              icon: 'warning',
              position: 'bottom-center',
              duration: 3500,
            });
          }
        });
      } else {
        this.$toasted.show(ChkErr, {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      }
    },
    BackLogin() {
      this.$router.push({ path: '/SURREALM/Admin/Login' });
    },
  },
  components: {
    DialogMsgMaintain,
  },
};
</script>

