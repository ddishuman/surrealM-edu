<template>
  <div id="login">
    <div class="loginContainer">
      <div class="logoArea">
        <img src="@/assets/img/SURREALM/Account/SurRealm_logo.png" class="logoSURREALM" />
      </div>
      <label class="lblSiginTitle">{{ $t('SURREALM.ForgetPw.PageName') }}</label>
      <label class="lblSiginSubTitle">{{ $t('SURREALM.ForgetPw.SubTitle') }}</label>

      <input class="txtbForgetPwEmail" v-model.trim="email" :placeholder="placeholder.email" />

      <button class="btnSURREALMLogin" @click="SendMail">{{ $t('SURREALM.ForgetPw.SendMail') }}</button>
      <label class="lblNoAcc">{{ $t('SURREALM.ForgetPw.RememberPw') }}</label>
      <button class="btnContactUs" @click="ToLoginPage">{{ $t('SURREALM.ForgetPw.Login') }}</button>
    </div>
    <div class="loginBackgroundM"></div>

    <Loading
      :active.sync="loadingInfo.isLoading"
      :can-cancel="false"
      :is-full-page="true"
      :color="loadingInfo.color"
      :opacity="loadingInfo.opacity"
      :background-color="loadingInfo.bgColor"
    ></Loading>
  </div>
</template>

<script>
import { apiForgetPW } from '@/request.js';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  data() {
    return {
      email: '',
      placeholder: {
        email: this.$t('SURREALM.ForgetPw.PlaceholderEmail'),
      },
      loadingInfo: {
        isLoading: false,
        color: '#fff',
        opacity: 0.9,
        bgColor: '#131217',
      },
    };
  },
  methods: {
    SendMail() {
      if (!this.TestEmail(this.email)) {
        this.$toasted.show(this.$t('SURREALM.Register.ErrMsg.Account'), {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      } else {
        this.loadingInfo.isLoading = true;
        apiForgetPW(this.email).then((res) => {
          this.loadingInfo.isLoading = false;
          if (res.data.Status == 'ok') {
            let data = {
              account: this.email,
            };
            this.$store.dispatch('ForgetPW', data).then((res) => {
              this.$router.push({ path: '/SURREALM/ForgetPWDone' });
              res;
            });
          } else {
            let errMsg = '';
            switch (res.data.Code) {
              case 2001:
                errMsg = this.$t('SURREALM.Login.Err.AccountFail');
                break;
              default:
                errMsg = this.$t('SURREALM.ApiErr') + res.data.Code;
                break;
            }
            this.$toasted.show(errMsg, {
              icon: 'warning',
              position: 'bottom-center',
              duration: 3500,
            });
          }
        });
      }
    },
    ToLoginPage() {
      this.$router.push({ path: '/SURREALM/Login' });
    },
  },
  components: {
    Loading,
  },
};
</script>
