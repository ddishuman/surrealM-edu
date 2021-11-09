<template>
  <div class="pnlDialogFull" v-show="show" style="">
    <div class="pnlDialogGray">
      <!-- @click.self="CloseDialog" -->
      <div class="pnlDialogPost">
        <div class="pnlTitle">
          <label>添加註解</label>
          <img class="btnDialogXX" src="@/assets/img/SURREALM/Backend/btn_close.png" @click="CloseDialog" />
        </div>
        <div class="pnlContent">
          <div class="subTitle" style="opacity: 0.01">.</div>
          <textarea v-model.trim="Note" class="PostContent"></textarea>
          <div class="toolArea">
            <button class="btnNoBg" @click="CloseDialog">
              {{ $t('SURREALM.Post.Cancel') }}
            </button>
            <button class="btnNoBg" @click="EditTagNote">儲存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DialogTageNote',
  props: {
    show: Boolean,
    index: Number,
    msg: String,
  },
  data() {
    return {
      Note: '',
    };
  },
  watch: {
    msg(str) {
      this.Note = str;
    },
    show(bool) {
      if (!bool) {
        this.Note = '';
      }
    },
  },
  computed: {},
  methods: {
    CloseDialog() {
      this.$emit('close-dialog');
    },
    EditTagNote() {
      let data = {
        Index: this.index,
        Note: this.Note,
      };
      this.$emit('edit-Note', data);
    },
  },
  components: {},
};
</script>