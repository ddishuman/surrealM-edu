<template>
  <div class="pnlDialogFull" v-show="show" style="">
    <div class="pnlDialogGray">
      <!-- @click.self="CloseDialog" -->
      <div class="pnlDialogMsg">
        <div class="pnlTitle">
          <label>{{ title }}</label>
          <img class="btnDialogXX" src="@/assets/img/SURREALM/Backend/btn_close.png" @click="CloseDialog" />
        </div>
        <div class="pnlContent">
          <label class="msg">{{ msg }}</label>
          <div class="toolArea">
            <button class="btnNoBg" v-if="isLeftBtnShow" @click="ClickLeftBtn">
              {{ txtLeftBtn }}
            </button>
            <button class="btnNoBg" @click="ClickRightBtn">
              {{ txtRightBtn }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DialogMsg',
  props: {
    show: Boolean,
    title: String,
    msg: String,
    isLeftBtnShow: Boolean,
    txtLeftBtn: String,
    txtRightBtn: String,
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