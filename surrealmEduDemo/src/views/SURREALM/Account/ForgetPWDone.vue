<template>
  <div id="login">
    <div class="loginContainer">
      <div class="logoArea">
        <img src="@/assets/img/SURREALM/Account/SurRealm_logo.png" class="logoSURREALM" />
      </div>
      <label class="lblSiginTitle">{{ $t('SURREALM.ForgetPwDone.PageName') }}</label>
      <label class="lblSuccessAndMail">{{ Content }}</label>
      <button class="btnSURREALMLogin" @click="ReMail">{{ $t('SURREALM.ForgetPwDone.ReMail') }}</button>
      <label class="lblNoAcc">{{ $t('SURREALM.ForgetPwDone.CantReceiveMail') }}</label>
      <!-- <button class="btnContactUs" @click="ContactUs">{{ $t('SURREALM.ForgetPwDone.ContantUs') }}</button> -->
    </div>
    <div class="loginBackgroundM"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      Content: '',
    };
  },
  mounted() {
    if (this.$store.state.SURREALM.ForgetPW.Email != '') {
      this.Content = this.$t('SURREALM.ForgetPwDone.Content') + ' ' + this.$store.state.SURREALM.ForgetPW.Email;
    } else {
      this.$router.push({ path: '/SURREALM/ForgetPW' });
    }
  },
  methods: {
    ReMail() {
      this.$router.push({ path: '/SURREALM/ForgetPW' });
    },
    ContactUs() {
      //Sam 說應該不需要這個了
    },
  },
};
</script>
