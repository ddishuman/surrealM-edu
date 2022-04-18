<template>
  <div class="pnlDialogFull" v-show="Show">
    <div class="pnlDialogGray">
      <div class="pnlDialogMsgMaintain">
        <div class="pnlTitle">
          <label>{{ Title }}</label>
          <img
            class="btnDialogXX"
            v-show="ShowClose"
            src="@/assets/img/SURREALM/Backend/btn_close.png"
            @click="CloseDialog()"
          />
        </div>
        <div class="pnlContent">
          <label class="msg">{{ Msg }}</label>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { apiMaintainMsg } from '@/request.js';
import '@/assets/js/dateFormat.js';

export default {
  name: 'DialogMsgMaintain',
  props: {},
  data() {
    return {
      Show: false,
      Title: '系統公告',
      Msg: '系統維護中，將無法使用網頁後台及VR端平台，造成您的不便，敬請見諒。',
      ShowClose: false,
    };
  },
  mounted() {
    this.CheckServer();
  },
  methods: {
    CloseDialog() {
      this.Show = false;
    },
    CheckServer() {
      apiMaintainMsg().then((res) => {
        if (res.data.Status == 'ok') {
          let data = res.data;
          // let data = {
          //   StartDate: '2022-02-06 12:00:00',
          //   EndDate: '2022-02-06 23:00:00',
          //   Msg: '系統將於XXXX/XX/XX XX:XX~XX/XX XX:XX進行更新維護，期間內將無法使用網頁後台及VR端平台，造成您的不便，敬請見諒。',
          // };
          let CurrentDate = new Date(this.DateToUTC8(new Date()));
          let StartDate = new Date(data.StartDate);
          let EndDate = new Date(data.EndDate);
          let SevenDayAgo = new Date(data.StartDate);
          SevenDayAgo.setDate(SevenDayAgo.getDate() - 7);

          // console.log(
          //   `CurrentDate: ${CurrentDate.format('yyyy-MM-dd hh:mm:ss').toString()}, ` +
          //     `StartDate: ${StartDate.format('yyyy-MM-dd hh:mm:ss').toString()}, EndDate: ${EndDate.format(
          //       'yyyy-MM-dd hh:mm:ss'
          //     ).toString()}, ` +
          //     `SevenDayAgo: ${SevenDayAgo.format('yyyy-MM-dd hh:mm:ss').toString()}`
          // );

          this.Msg = data.Msg;
          if (StartDate.getTime() <= CurrentDate.getTime() && CurrentDate.getTime() <= EndDate.getTime()) {
            this.Show = true;
            this.ShowClose = false;
          } else if (SevenDayAgo.getTime() <= CurrentDate.getTime() && CurrentDate.getTime() <= StartDate.getTime()) {
            this.Show = true;
            this.ShowClose = true;
          } else {
            this.Show = false;
          }
        } else {
          this.$toasted.show(res.data.Error, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },
  },
};
</script>