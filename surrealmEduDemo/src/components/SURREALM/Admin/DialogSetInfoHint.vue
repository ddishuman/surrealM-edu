<template>
  <div class="dialog-full" v-show="Show">
    <div class="dialog-gray">
      <div class="dialog-setinfo-hint">
        <div class="title-area">
          <label class="title-txt">此管理者帳號已存在</label>
        </div>
        <label class="msg-content">
          如為舊用戶續租，請聯繫客服人員處理：<br />
          <img class="icon-alart" src="@/assets/img/SURREALM/Admin/icon_email_1.png" />
          webservice@surreal.com.tw<br />
          <img class="icon-alart" src="@/assets/img/SURREALM/Admin/icon_phone_1.png" />
          +886-2-8772-5848
        </label>
        <div class="btn-tool">
          <button class="btn-center" @click="CloseDialog()">確認</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DialogSetInfoHint',
  props: {
    Show: Boolean,
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    CloseDialog() {
      this.$emit('close-dialog');
    },
  },
};
</script>