<template>
  <div id="login">
    <div class="loginContainer">
      <div class="logoArea">
        <img src="@/assets/img/SURREALM/Account/SurRealm_logo.png" class="logoSURREALM" />
      </div>
      <label class="lblSiginTitle">{{ $t('SURREALM.Login.Login') }}</label>
      <label class="lblSiginSubTitle" style="margin-top: 0px">{{ $t('SURREALM.PageName') }}</label>

      <div class="formWrapping">
        <div style="line-height: 34px">{{ $t('SURREALM.Login.Account') }}</div>
        <button class="btnSURREALMForgetPw" @click="ForgetPw">{{ $t('SURREALM.Login.ForgetPw') }}</button>
        <input type="text" class="loginKeyin" v-model.trim="account" :placeholder="placeholder.email" />
        <div style="line-height: 34px">{{ $t('SURREALM.Login.Password') }}</div>
        <input
          type="password"
          class="loginKeyin"
          v-model.trim="password"
          @keyup.enter="Login"
          :placeholder="placeholder.pw"
        />
      </div>
      <button class="btnSURREALMLogin" @click="Login">{{ $t('SURREALM.Login.Login') }}</button>
      <!-- <label class="lblNoAcc">{{ $t('SURREALM.Login.NoAccount') }}</label>
      <button class="btnRegister" @click="Register">{{ $t('SURREALM.Login.Register') }}</button> -->
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
  },
};
</script>
