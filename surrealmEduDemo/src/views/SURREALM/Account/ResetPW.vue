<template>
  <div id="login">
    <div class="loginContainer">
      <div class="logoArea">
        <img src="@/assets/img/SURREALM/Account/SurRealm_logo.png" class="logoSURREALM" />
      </div>
      <label class="lblSiginTitle">{{ $t('SURREALM.ResetPW.PageName') }}</label>
      <div class="formWrapping">
        <div style="line-height: 34px">{{ $t('SURREALM.ResetPW.NewPW') }}</div>
        <input
          type="password"
          :class="style.password"
          v-model.trim="password"
          @keyup.enter="Login"
          :placeholder="placeholder.pw"
        />
        <label class="loginKeyinErr">{{ err.password }}</label>
        <div style="line-height: 34px">{{ $t('SURREALM.Register.ConfirmPw') }}</div>
        <input
          type="password"
          :class="style.passwordAgain"
          v-model.trim="passwordAgain"
          @keyup.enter="Login"
          :placeholder="placeholder.pwAgain"
        />
        <label class="loginKeyinErr">{{ err.passwordAgain }}</label>
      </div>

      <button class="btnSURREALMLogin" @click="ResetPW">{{ $t('SURREALM.ResetPW.Reset') }}</button>
    </div>
    <div class="loginBackgroundM"></div>
  </div>
</template>

<script>
import { apiResetPW } from '@/request.js';
import sha256 from 'sha256';

export default {
  data() {
    return {
      placeholder: {
        pw: this.$t('SURREALM.Login.PlaceholderPw'),
        pwAgain: this.$t('SURREALM.Register.PlaceholderPwAgain'),
      },
      password: '',
      passwordAgain: '',
      err: {
        password: '',
        passwordAgain: '',
      },
      style: {
        password: 'loginKeyin',
        passwordAgain: 'loginKeyin',
      },
      QueryString: {
        serial: '',
        email: '',
      }
    };
  },
  watch: {
    password(str) {
      if (!this.TestPassword(str)) {
        this.err.password = this.$t('SURREALM.Register.ErrMsg.Password');
        this.style.password = 'loginKeyinErrBorder';
      } else {
        this.err.password = '';
        this.style.password = 'loginKeyin';
      }
      if (this.passwordAgain != str) {
        this.err.passwordAgain = this.$t('SURREALM.Register.ErrMsg.PasswordAgain');
        this.style.passwordAgain = 'loginKeyinErrBorder';
      } else {
        this.err.passwordAgain = '';
        this.style.passwordAgain = 'loginKeyin';
      }
    },
    passwordAgain(str) {
      if (str != this.password) {
        this.err.passwordAgain = this.$t('SURREALM.Register.ErrMsg.PasswordAgain');
        this.style.passwordAgain = 'loginKeyinErrBorder';
      } else {
        this.err.passwordAgain = '';
        this.style.passwordAgain = 'loginKeyin';
      }
    },
  },
  mounted() {
    //get queryString
    this.serial = this.GetParameterByName('s');
    this.email = this.GetParameterByName('e');
    if (this.serial == null && this.email == null) {
      this.$router.push({ path: '/SURREALM/Login' });
    }
  },
  methods: {
    ResetPW() {
      let chkErr = this.chkResetPWError();
      if (chkErr != '') {
        this.$toasted.show(chkErr, {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      } else {
        let data = {
          "PW": sha256(this.password),
          "Serial": Number(this.serial)
        };
        apiResetPW(this.email,data).then((res) => {
          if (res.data.Status == 'ok') {
            this.$router.push({ path: '/SURREALM/ResetPWDone' });
          } else {
            this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
              icon: 'warning',
              position: 'bottom-center',
              duration: 3500,
            });
          }
        });
      }
    },
    chkResetPWError() {
      let errMsg = '';
      if (this.password.trim() == '' || this.passwordAgain.trim() == '') {
        errMsg = this.$t('SURREALM.Login.PlaceholderPw');
      } else if (!this.TestPassword(this.password)) {
        errMsg = this.$t('SURREALM.Register.ErrMsg.Password');
      } else if (this.passwordAgain != this.password) {
        errMsg = this.$t('SURREALM.Register.ErrMsg.PasswordAgain');
      }
      return errMsg;
    },
  },
};
</script>
