<template>
  <div class="dialog-full" v-show="Show">
    <div class="dialog-gray">
      <div class="dialog-msg">
        <label class="msg-content" v-html="Msg"></label>
        <div class="btn-tool">
          <button class="btn-center" @click="CloseDialog()">確認</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DialogMsg',
  props: {
    Show: Boolean,
    Msg: String,
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