<template>
  <div id="ErrToken">
    <DialogMsg
      :show="dialogDelLink.show"
      :title="dialogDelLink.title"
      :msg="dialogDelLink.msg"
      :isLeftBtnShow="dialogDelLink.isLeftBtnShow"
      :txtLeftBtn="dialogDelLink.txtLeftBtn"
      :txtRightBtn="dialogDelLink.txtRightBtn"
      @close-dialog="DoNothing"
      @click-left="DoNothing"
      @click-right="ReLogin"
    ></DialogMsg>
  </div>
</template>

<script>
import DialogMsg from '@/components/SURREALM/Backend/DialogMsg.vue';

export default {
  mounted() {
    this.page = this.GetParameterByName('Page');
    this.type = this.GetParameterByName('Type');
  },
  data() {
    return {
      dialogDelLink: {
        show: true,
        title: this.$t('SURREALM.Login.Warning'),
        msg: this.$t('SURREALM.Login.Err.ReLoginMsg'),
        isLeftBtnShow: false,
        txtLeftBtn: '',
        txtRightBtn:this.$t('SURREALM.Login.ReLoginConfirm'),
      },
      show: true,
      page: '',
      type: '',
    };
  },
  computed: {},
  methods: {
    DoNothing() {
      //
    },
    ReLogin() {
      let loginPath = '';
      if (this.type == 'surrealm') {
        loginPath = '/SURREALM';
      }
      localStorage.clear();
      location.replace(loginPath + '/login?page=' + this.page);
    },
  },
  components: {
    DialogMsg,
  },
};
</script>
<style>
body {
  background: #1b1a1f;
}
</style>