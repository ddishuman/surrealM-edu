<template>
  <div class="pnlDialogFull" v-if="show" style="">
    <div class="pnlDialogGray" v-if="IsCheckID">
      <!-- @click.self="CloseDialog" -->
      <div class="pnlDialogLive">
        <div class="pnlTitle">
          <label>{{ title }}</label>
          <img class="btnDialogXX" src="@/assets/img/SURREALM/Backend/btn_close.png" @click="CloseDialog" />
        </div>
        <div class="pnlContent">
          <StreamingView />
        </div>
      </div>
    </div>
    <DialogMsg
      :show="dialogChkID.show"
      :title="dialogChkID.title"
      :msg="dialogChkID.msg"
      :isLeftBtnShow="dialogChkID.isLeftBtnShow"
      :txtLeftBtn="dialogChkID.txtLeftBtn"
      :txtRightBtn="dialogChkID.txtRightBtn"
      @close-dialog="CloseChkID"
      @click-left="CloseChkID"
      @click-right="ContinueLive"
    ></DialogMsg>
  </div>
</template>
<script>
import DialogMsg from '@/components/SURREALM/Backend/DialogMsg.vue';
import StreamingView from '@/components/SURREALM/Backend/StreamingView.vue';

export default {
  name: 'DialogLive',
  props: {
    show: Boolean,
    serial: Number,
    title: String,
    code: String,
  },
  data() {
    return {
      dialogChkID: {
        show: false,
        title: '',
        msg: '',
        isLeftBtnShow: true,
        txtLeftBtn: '',
        txtRightBtn: '',
      },
      Fullscreen: {
        IsFull: false,
        Teleport: true,
      },
      IsCheckID: false,
    };
  },
  watch: {
    show(bool) {
      if (bool) {
        this.ShowChkID();
      }
    },
  },
  methods: {
    CloseDialog() {
      this.$socket.emit('LeaveRoom');
      this.$socket.disconnect();
      this.IsCheckID = false;
      this.$emit('close-dialog');
    },
    CloseChkID() {
      this.dialogChkID.title = '';
      this.dialogChkID.msg = '';
      this.dialogChkID.isLeftBtnShow = true;
      this.dialogChkID.txtLeftBtn = '';
      this.dialogChkID.txtRightBtn = '';
      this.dialogChkID.show = false;
      this.CloseDialog();
    },
    ShowChkID() {
      this.dialogChkID.title = this.$t('SURREALM.LIVE.ChkID.Title');
      this.dialogChkID.msg = this.$t('SURREALM.LIVE.ChkID.Msg', { msg: this.$store.state.Profile.Name });
      this.dialogChkID.isLeftBtnShow = true;
      this.dialogChkID.txtLeftBtn = this.$t('SURREALM.LIVE.ChkID.LeftBtn');
      this.dialogChkID.txtRightBtn = this.$t('SURREALM.LIVE.ChkID.RightBtn');
      this.dialogChkID.show = true;
    },
    ContinueLive() {
      this.dialogChkID.show = false;
      //Start Live
      this.IsCheckID = true;
      this.$socket.connect();
    },
  },
  sockets: {
    connect: function () {
      console.log('socket connect');
      let Account = localStorage.getItem('Account');
      this.$socket.emit('RegServerId', { Type: 'C', LectureCode: this.code, Account: Account });
      //console.log(`Socket RegServerId LectureCode:${this.code} , Account:${Account}`);
    },
  },
  components: {
    DialogMsg,
    StreamingView,
  },
};
</script>