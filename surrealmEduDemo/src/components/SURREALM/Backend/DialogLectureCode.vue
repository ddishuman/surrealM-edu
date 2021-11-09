<template>
  <div class="pnlDialogFull" v-show="show" style="">
    <div class="pnlDialogGray" @click.self="CloseDialog">
      <div class="pnlDialogLectureCode">
        <div class="pnlTitle">
          <label>{{ $t('SURREALM.LectureCode.Code') }}</label>
          <img class="btnDialogXX" src="@/assets/img/SURREALM/Backend/btn_close.png" @click="CloseDialog" />
        </div>
        <div class="pnlContent">
          <div class="lectureCodeArea">
            <input ref="lectureCode" class="txtCode" type="text" v-model.trim="this.lectureCode" :disabled="disabled" />
            <input type="text" class="txtCodeFake" v-model.trim="this.lectureCode" disabled="true" />
            <button class="btnCopy" @click="CopyLectureCode">{{ $t('SURREALM.LectureCode.Copy') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'pnlDialogLectureCode',
  props: {
    show: Boolean,
    lectureCode: String,
  },
  data() {
    return {
      disabled: false,
    };
  },
  methods: {
    CloseDialog() {
      this.$emit('close-dialog');
    },
    CopyLectureCode() {
      this.$refs.lectureCode.select();
      document.execCommand('copy');
      this.$toasted.show(`${this.$t('SURREALM.LectureCode.Copied')} ${this.lectureCode}`, {
        icon: 'warning',
        position: 'bottom-center',
        duration: 3500,
      });
      this.CloseDialog();
    },
  },
};
</script>