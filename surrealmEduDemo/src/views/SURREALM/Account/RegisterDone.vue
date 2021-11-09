<template>
  <div id="login">
    <div class="loginContainer">
      <div class="logoArea">
        <img src="@/assets/img/SURREALM/Account/SurRealm_logo.png" class="logoSURREALM" />
      </div>
      <label class="lblSiginTitle">{{ $t('SURREALM.RegisterDone.PageName') }}</label>
      <label class="lblSuccessAndMail">{{ Content }}</label>
      <button class="btnSURREALMLogin" @click="ReMail">{{ $t('SURREALM.RegisterDone.ReMail') }}</button>
      <label class="lblNoAcc">{{ $t('SURREALM.RegisterDone.CantReceiveMail') }}</label>
      <!-- <button class="btnContactUs" @click="ContactUs">{{ $t('SURREALM.RegisterDone.ContantUs') }}</button> -->
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
    if (this.$store.state.SURREALM.Register.Email != '') {
      this.Content = this.$t('SURREALM.RegisterDone.Content') + ' ' + this.$store.state.SURREALM.Register.Email;
    } else {
      this.$router.push({ path: '/SURREALM/Login' });
    }
  },
  methods: {
    ReMail() {
      //TODO 目前沒有註冊流程 API send Active Mail (params: email) url QueryString (email,serial ex: ?e=ian@faya.com.tw&s=1)
      //TODO Ian 可能要設定多久才能按一次
    },
    ContactUs() {
      //Sam 說應該不需要這個了
    },
  },
};
</script>
