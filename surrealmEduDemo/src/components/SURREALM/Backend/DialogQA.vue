<template>
  <div class="pnlDialogFull" v-show="show" style="">
    <div class="pnlDialogGray">
      <!-- @click.self="CloseDialog" -->
      <div class="pnlDialogQA">
          <img class="imgIcon" :src="imgSrc" />
          <div class="pnlMsgArea">
            <ul>
              <li
                v-for="item of msgs"
                :key="item"
                v-html="item"
                class="msgItems"
              ></li>
            </ul>
          </div>
          <button class="btn btnConfirm" @click="BtnClick">{{ btnTxt }}</button>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DialogQA',
  props: {
    show: Boolean,
    msgs: Array,
    btnTxt: String,
    imgSrc: String,
  },
  data() {
    return {};
  },
  methods: {
    CloseDialog() {
      this.$emit("close-dialog");
    },
    BtnClick() {
      this.$emit("btn-click");
    },
  },
};
</script>