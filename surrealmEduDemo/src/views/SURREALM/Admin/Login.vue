<template>
  <div id="login" class="admin-login">
    <div class="login-area">
      <img src="@/assets/img/SURREALM/Admin/logo_2.png" class="login-logo" />
      <div class="login-keyin-area">
        <h2 class="login-title">Surrealm管理者後台</h2>
        <div class="login-desc">帳號</div>
        <input type="text" class="login-input" v-model.trim="Account" :placeholder="Placeholder.Email" />
        <div class="login-desc">密碼</div>
        <input
          type="password"
          class="login-input"
          v-model.trim="Password"
          @keyup.enter="Login()"
          :placeholder="Placeholder.Pw"
        />
        <button class="login-btn" @click="Login()">登入</button>
        <button class="login-forget-pw" @click="ForgetPW()">忘記密碼?</button>
      </div>
    </div>
    <DialogMsgMaintain />
  </div>
</template>

<script>
import DialogMsgMaintain from '@/components/SURREALM/Backend/DialogMsgMaintain.vue';
import sha256 from 'sha256';

export default {
  data() {
    return {
      Placeholder: {
        Email: this.$t('SURREALM.Login.PlaceholderEmail'),
        Pw: this.$t('SURREALM.Login.PlaceholderPw'),
      },
      Account: '',
      Password: '',
    };
  },
  methods: {
    Login() {
      let data = {
        Account: this.Account,
        Password: sha256(this.Password),
        Platform: 'Web',
      };
      this.$store.dispatch('ADMINLOGIN', data).then((res) => {
        if (res.Status == 'ok') {
          this.$router.push({ path: '/SURREALM/Admin/AccountSetting' });
        } else {
          let errMsg = 0;
          switch (res.Code) {
            case 2001:
              errMsg = this.$t('SURREALM.Login.Err.AccountFail');
              break;
            case 2002:
              errMsg = this.$t('SURREALM.Login.Err.PasswordFail');
              break;
            case 2004:
              errMsg = this.$t('SURREALM.Login.Err.ActiveFail');
              break;
          }
          this.$toasted.show(errMsg, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },
    ForgetPW() {
      this.$router.push({ path: '/SURREALM/Admin/ForgetPW' });
    },
  },
  components: {
    DialogMsgMaintain,
  },
};
</script>

