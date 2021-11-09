<template>
  <div id="login">
    <div class="loginContainer">
      {{ acc }}
    </div>
    <div class="loginBackgroundM"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      acc: '',
    };
  },
  mounted() {
    //http://localhost:8080/SURREALM/OpenIDRes
    let OpenIDCode = this.GetParameterByName('code');
    let OpenIDState = this.GetParameterByName('state');
    if (OpenIDCode != null && OpenIDCode != '' && OpenIDState != null && OpenIDState != '') {
      //console.log(`OpenIDCode: ${OpenIDCode} , OpenIDState: ${OpenIDState}`);
      let data = {
        Code: OpenIDCode,
        RedirectUrl: this.GetRedirectUri(),
        Platform: 'Web',
      };

      this.$store.dispatch('OPENIDLOGIN', data).then((res) => {
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
  methods: {},
};
</script>
