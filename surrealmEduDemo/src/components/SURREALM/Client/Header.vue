<template>
  <header>
    <div class="SurrealmHeader">
      <div class="headerCenter">
        <a href="#" class="headerLogoArea">
          <img src="@/assets/img/SURREALM/Backend/header_logo.png" class="headerLogoImg" />
          <span class="headerLogoTxt">{{ title }}</span>
        </a>
        <a class="headerLogout" @click="Logout">{{ $t('SURREALM.Header.Logout') }}</a>
        <div class="pnlUserInfo">
          <label class="lblUser">{{ userName }}</label>
        </div>
      </div>
    </div>
    <!-- Header的底 -->
    <div style="width: 100%; height: 90px"></div>
    <DialogMsgUpdate />
  </header>
</template>
<script>
import DialogMsgUpdate from '@/components/SURREALM/Backend/DialogMsgUpdate.vue';

export default {
  name: 'Header',
  props: {
    title: String,
    logoutPath: String,
  },
  data() {
    return {};
  },
  computed: {
    userName: function () {
      return this.$store.state.Profile.Name;
    },
  },
  methods: {
    Logout() {
      this.$store.dispatch('LOGOUT');
      this.$router.push({ path: this.logoutPath });
    },
  },
  components: {
    DialogMsgUpdate,
  },
};
</script>

