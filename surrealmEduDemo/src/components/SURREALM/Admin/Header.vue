<template>
  <header>
    <div class="adimn-header">
      <h3 class="admin-header-title">SURREALM 管理者後台</h3>
      <div class="admin-header-user">{{ userName }}</div>
      <img src="@/assets/img/SURREALM/Admin/icon_header_account.png" class="admin-header-icon" />
      <button class="admin-header-logout" @click="Logout()">登出</button>
    </div>    
  </header>
</template>
<script>

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
      return this.$store.state.Admin.ContactName;
    },
  },
  methods: {
    Logout() {
      this.$store.dispatch('LOGOUT');
      this.$router.push({ path: this.logoutPath });
    },
  },
  components: {
  },
};
</script>

