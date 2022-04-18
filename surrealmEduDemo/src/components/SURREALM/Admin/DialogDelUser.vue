<template>
  <div class="dialog-full" v-show="Show">
    <div class="dialog-gray">
      <div class="dialog-del-user">
        <div class="title-area">
          <img class="icon-alart" src="@/assets/img/SURREALM/Admin/icon_alart.png" />
          <label class="title-txt">確定刪除 ?</label>
        </div>
        <label class="del-desc">
          您是否確定刪除本帳號的使用權？<br />
          刪除後如需恢復原有帳號，需洽客服人員。
        </label>
        <div class="btn-tool">
          <button class="btn-left" @click="CloseDialog()">取消</button>
          <button class="btn-right" @click="DelUser()">刪除</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DialogDelUser',
  props: {
    Show: Boolean,
    Serial: Number,
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    CloseDialog() {
      this.$emit('close-dialog');
    },
    DelUser() {
      this.$emit('del-user');
    },
  },
};
</script>