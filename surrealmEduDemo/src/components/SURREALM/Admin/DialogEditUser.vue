<template>
  <div class="dialog-full" v-show="Show">
    <div class="dialog-gray">
      <div class="dialog-edit-user">
        <div class="title-area">
          <label class="title-txt">姓名變更</label>
        </div>
        <div class="keyin-desc">姓名</div>
        <input class="keyin-input" type="text" v-model.trim="UserName" placeholder="輸入姓名" />
        <div class="btn-tool">
          <button class="btn-left" @click="CloseDialog()">取消</button>
          <button class="btn-right" @click="EditUser()">確定</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DialogEditUser',
  props: {
    Show: Boolean,
    Name: String,
    Serial: Number,
  },
  data() {
    return {
      UserName: '',
    };
  },
  watch: {
    Show(bool) {
      if (bool) {
        this.UserName = this.Name;
      }
    },
  },
  mounted() {},
  methods: {
    CloseDialog() {
      this.$emit('close-dialog');
    },
    EditUser() {
      let ChkMsg = this.ChkError();
      if (ChkMsg == '') {
        let Data = {
          Serial: this.Serial,
          Name: this.UserName,
        };
        this.$emit('close-dialog');
        this.$emit('edit-down', Data);
      } else {
        this.$toasted.show(ChkMsg, {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      }
    },
    ChkError() {
      let ErrMsg = '';
      if (this.UserName.trim() == '') {
        ErrMsg = '請填寫姓名。';
      }
      return ErrMsg;
    },
  },
  components: {},
};
</script>