<template>
  <footer>
    <div class="admin-footer">
      <div class="footer-center">
        <h3 class="footer-txt">如您有任何帳號問題，或欲辦理帳號續租，請與我們聯繫</h3>
        <div class="footer-cut-line"></div>
        <h3 class="footer-txt">超現實科技股份有限公司</h3>
        <img class="footer-img" src="@/assets/img/SURREALM/Admin/icon_email.png" />
        <h3 class="footer-txt">webservice@surreal.com.tw</h3>
        <img class="footer-img" src="@/assets/img/SURREALM/Admin/icon_phone.png" />
        <h3 class="footer-txt">+886-2-8772-5848</h3>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  name: 'Footer',
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
  components: {},
};
</script>

