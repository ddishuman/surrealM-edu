<template>
  <div class="dialog-full" v-show="Show">
    <div class="dialog-gray">
      <div class="dialog-msg-twobtn">
        <div class="title-area">
          <label class="title-txt">{{ Title }}</label>
        </div>
        <label class="msg-content" v-html="Msg"> </label>
        <div class="btn-tool">
          <button class="btn-left" @click="ClickLeftBtn()">{{ TxtLeftBtn }}</button>
          <button class="btn-right" @click="ClickRightBtn()">{{ TxtRightBtn }}</button>
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
    Title: String,
    Msg: String,
    TxtLeftBtn: String,
    TxtRightBtn: String,
  },
  data() {
    return {};
  },
  methods: {
    CloseDialog() {
      this.$emit('close-dialog');
    },
    ClickLeftBtn() {
      this.$emit('click-left');
    },
    ClickRightBtn() {
      this.$emit('click-right');
    },
  },
};
</script>