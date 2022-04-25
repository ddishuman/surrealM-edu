<template>
  <div class="pnlDialogFull" v-show="Show">
    <div class="pnlDialogGray">
      <div class="pnlDialogMsgUpdate">
        <div class="pnlTitle">
          <label>系統公告</label>
          <img class="btnDialogXX" src="@/assets/img/SURREALM/Backend/btn_close.png" @click="CloseDialog()" />
        </div>
        <div class="pnlContent">
          <label class="msg">
            VR頭盔應用程式已更新，請至「檔案下載」<br />頁面下載並安裝最新版本至您的頭盔，否則將無法繼續使用。
            <br />
            <br />
            <br />
            檔案版本：{{ Version }}<br />
            更新日期：{{ ReleaseDate }}
          </label>
          <button class="goDownload" @click="DownloadPage()">前往下載</button>
          <div class="dontShowAgain">
            <input type="checkbox" id="Show" v-model="DontShowAgain" />
            <label for="Show">不再顯示</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { apiGetLastApkInfo } from '@/request.js';
import '@/assets/js/dateFormat.js';

export default {
  name: 'DialogMsgUpdate',
  props: {},
  data() {
    return {
      Show: false,
      Title: '系統公告',
      Version: '',
      ReleaseDate: '',
      DontShowAgain: false,
    };
  },
  mounted() {
    let path = this.$route.fullPath;
    //在下載頁就不用顯示
    if (!path.includes('Download') && !path.includes('Guide')) {
      this.CheckAPKVersion();
    }
  },
  methods: {
    CloseDialog() {
      this.Show = false;
    },
    CheckAPKVersion() {
      //TODO API /lastapkinfo (get)
      apiGetLastApkInfo().then((res) => {
        if (res.data.Status == 'ok') {
          this.Version = res.data.Version;
          this.ReleaseDate = res.data.ReleaseDate;

          let CurrentDate = new Date(this.DateToUTC8(new Date()));
          let SetDontAgain = localStorage.getItem('SetDontAgainDateUTC8');
          if (SetDontAgain != null) {
            let SetDontAgainDateUTC8 = new Date(SetDontAgain);
            let LastReleaseDate = new Date(this.ReleaseDate);
            if (
              LastReleaseDate.getTime() > SetDontAgainDateUTC8.getTime() &&
              CurrentDate.getTime() > LastReleaseDate.getTime()
            ) {
              this.Show = true;
            }
          } else {
            this.Show = true;
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
    DownloadPage() {
      if (this.DontShowAgain) {
        let CurrentDate = new Date(this.DateToUTC8(new Date()));
        localStorage.setItem('SetDontAgainDateUTC8', CurrentDate.format('yyyy-MM-dd hh:mm:ss').toString());
      }
      this.CloseDialog();
      this.$router.push({ path: '/SURREALM/Backend/Download' });
    },
  },
};
</script>