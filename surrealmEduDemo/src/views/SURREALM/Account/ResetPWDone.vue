<template>
  <div id="login">
    <div class="loginContainer">
      <div class="logoArea">
        <img src="@/assets/img/SURREALM/Account/SurRealm_logo.png" class="logoSURREALM" />
      </div>
      <label class="lblSiginTitle" >{{ $t('SURREALM.ResetPWDone.PageName') }}</label>
      <label class="lblSuccessAndMail" v-html="$t('SURREALM.ResetPWDone.Content')"></label>
      <button class="btnSURREALMLogin" @click="ToLoginPage">{{ $t('SURREALM.ResetPWDone.Login') }}</button>
    </div>
    <div class="loginBackgroundM"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {
    ToLoginPage(){
      this.$router.push({ path: '/SURREALM/Login' });
    }
  },
};
</script>
