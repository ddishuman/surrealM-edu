<template>
  <div id="login">
    <div class="loginContainer">
      <div class="logoArea">
        <img src="@/assets/img/SURREALM/Account/SurRealm_logo.png" class="logoSURREALM" />
      </div>
      <label class="lblSiginTitle">{{ $t('SURREALM.PageName') }}</label>
      <label class="lblSiginSubTitle">{{ $t('SURREALM.Login.Hint') }}</label>

      <button class="btnConfirm" @click="OpenIDLogin">{{ $t('SURREALM.Login.OpenIDLogin') }}</button>
    </div>
    <div class="loginBackgroundM"></div>
  </div>
</template>

<script> 
import sha256 from 'sha256';

export default {
  data() {
    return {
      placeholder: {
        email: this.$t('SURREALM.Login.PlaceholderEmail'),
        pw: this.$t('SURREALM.Login.PlaceholderPw'),
      },
      account: '',
      password: '',
      errorCode: 0,
    };
  },
  methods: {
    Login() {
      let data = {
        Account: this.account,
        Password: sha256(this.password),
        Platform: 'Web',
      };
      this.$store.dispatch('LOGIN', data).then((res) => {
        if (res.Status == 'ok') {
          if (res.Data.Role.toLowerCase() == 'teacher') {
            if (res.Data.Subject == '') {
              this.$router.push({ path: '/SURREALM/Backend/Guide' });
            } else {
              this.$router.push({ path: '/SURREALM/Backend/Home' });
            }
          } else {
            if (res.Data.Sex == '') {
              this.$router.push({ path: '/SURREALM/Client/Guide' });
            } else {
              this.$router.push({ path: '/SURREALM/Client/LectureOwn' });
            }
          }
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
    ForgetPw() {
      this.$router.push({ path: '/SURREALM/ForgetPW' });
    },
    Register() {
      this.$router.push({ path: '/SURREALM/Register' });
    },
    OpenIDLogin() {
      let currentMillisecond = new Date().getTime();
      let client_id = '83fc8ede4196a0adcaf8bf044881c805';
      let redirect_uri = this.GetRedirectUri();
      let state = 'surrealmState' + currentMillisecond;
      let nonce = 'surrealmNonce' + currentMillisecond;
      let url = `https://hlc.sso.edu.tw/oidc/v1/azp?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=openid+email+profile&state=${state}&nonce=${nonce}`;
      //console.log('testOpenID url:' + url);
      window.location = url;
    },
  },
};
</script>
