<template>
  <div id="login">
    <div class="loginContainer">
      <button class="btnSURREALMLogin" @click="testOpenID">OpenID Login</button>
    </div>
    <div class="loginBackgroundM"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    testOpenID() {
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
