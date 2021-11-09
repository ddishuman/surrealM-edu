<template>
  <div id="login">
    <div class="loginContainer">
      <label class="lblSiginTitle" style="margin: 20px 0 52px">{{ $t('SURREALM.Register.PageName') }}</label>

      <div class="formWrapping">
        <div style="line-height: 34px">{{ $t('SURREALM.Login.Account') }}</div>
        <input type="text" :class="style.account" v-model.trim="account" :placeholder="placeholder.email" />
        <label class="loginKeyinErr">{{ err.account }}</label>
        <div style="line-height: 34px">{{ $t('SURREALM.Login.Password') }}</div>
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
      <button class="btnSURREALMLogin" @click="Register">{{ $t('SURREALM.Register.PageName') }}</button>
      <label class="lblNoAcc">{{ $t('SURREALM.Register.HasAccount') }}</label>
      <button class="btnRegister" @click="Login">{{ $t('SURREALM.Register.Login') }}</button>
    </div>
    <div class="loginBackgroundM"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      placeholder: {
        email: this.$t('SURREALM.Login.PlaceholderEmail'),
        pw: this.$t('SURREALM.Login.PlaceholderPw'),
        pwAgain: this.$t('SURREALM.Register.PlaceholderPwAgain'),
      },
      account: '',
      password: '',
      passwordAgain: '',
      err: {
        account: '',
        password: '',
        passwordAgain: '',
      },
      style: {
        account: 'loginKeyin',
        password: 'loginKeyin',
        passwordAgain: 'loginKeyin',
      },
    };
  },
  watch: {
    account(str) {
      if (!this.TestEmail(str)) {
        this.err.account = this.$t('SURREALM.Register.ErrMsg.Account');
        this.style.account = 'loginKeyinErrBorder';
      } else {
        this.err.account = '';
        this.style.account = 'loginKeyin';
      }
    },
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
  methods: {
    Register() {
      //TODO 目前沒有註冊流程 API Register (params: email, password)
      //註冊完要 send active mail url QueryString (email,serial ex: ?e=ian@faya.com.tw&s=1)
      //log(`Register, acc:${this.account}, pw:${this.password}, pwa:${this.passwordAgain}`);
      let chkErr = this.chkRegisterError();
      if (chkErr != '') {
        this.$toasted.show(chkErr, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
      } else {
        let data = {
          account: this.account,
          password: this.password,
        };
        this.$store.dispatch('Register', data).then((res) => {
          this.$router.push({ path: '/SURREALM/RegisterDone' });
          res;
          //this.ConsoleLog(`res: ${res}, GetTheLecture: ${JSON.stringify(this.$store.state.Controller)}`)
        });
      }
    },
    Login() {
      this.$router.push({ path: '/SURREALM/Login' });
    },
    chkRegisterError() {
      let errMsg = '';
      if (this.account.trim() == '' || this.password.trim() == '' || this.passwordAgain.trim() == '') {
        errMsg = this.$t('SURREALM.Register.ErrMsg.AccPwNull');
      } else if (!this.TestEmail(this.account)) {
        errMsg = this.$t('SURREALM.Register.ErrMsg.Account');
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
