<template>
  <div id="login">
    <div class="loginContainer">
      <div class="logoArea">
        <img src="@/assets/img/SURREALM/Account/SurRealm_logo.png" class="logoSURREALM" />
      </div>
      <label class="lblSiginTitle">{{ $t('SURREALM.Active.PageName') }}</label>
      <label class="lblSuccessAndMail" v-html="$t('SURREALM.Active.Content')"></label>
      <button class="btnSURREALMLogin" @click="ToLoginPage">{{ $t('SURREALM.Active.LoginNow') }}</button>
    </div>
    <div class="loginBackgroundM"></div>
  </div>
</template>

<script>
import { apiActivate } from '@/request.js';

export default {
  data() {
    return {
      QueryString: {
        serial: '',
        email: '',
      },
    };
  },
  mounted() {
    this.serial = this.GetParameterByName('s');
    this.email = this.GetParameterByName('e');
    if (this.serial == null && this.email == null) {
      this.$router.push({ path: '/SURREALM/Login' });
    } else {
      let data = {
        Account: this.email,
        Serial: Number(this.serial),
      };
      apiActivate(data).then((res) => {
        if (res.data.Status == 'ok') {
          this.$toasted.show(this.$t('SURREALM.Active.PageName'), {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        } else {
          this.$toasted.show(res.data.Error, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    }
  },
  methods: {
    ToLoginPage() {
      this.$router.push({ path: '/SURREALM/Login' });
    },
  },
};
</script>
