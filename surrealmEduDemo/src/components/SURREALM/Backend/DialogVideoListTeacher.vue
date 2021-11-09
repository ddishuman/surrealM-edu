<template>
  <div class="pnlDialogFull" v-show="show" style="">
    <div class="pnlDialogGray">
      <!-- @click.self="CloseDialog" -->
      <div class="pnlDialogVideoList">
        <div class="pnlTitle">
          <label>{{ lectureName }}</label>
          <img class="btnDialogXX" src="@/assets/img/SURREALM/Backend/btn_close.png" @click="CloseDialog" />
        </div>
        <div class="pnlContent">
          <div class="VideoItem" v-for="(vdo, index) in VideoList" :key="index">
            <img src="@/assets/img/SURREALM/Backend/LectureManager/default_lecture.jpg" @click.self="ShowVideo(vdo)" />
            <div class="tools">
              <img
                class="imgTools"
                src="@/assets/img/SURREALM/Backend/LectureManager/icon_share.png"
                @click="ShowShareVideo(vdo.Serial, vdo.Share)"
              />
              <img
                class="imgTools"
                src="@/assets/img/SURREALM/Backend/LectureManager/icon_time_xl.png"
                @click="ShowVideo(vdo)"
              />
              <img
                class="imgTools"
                src="@/assets/img/SURREALM/Backend/LectureManager/icon_delete_xl.png"
                @click="ShowDeleteVideo(vdo.Serial, vdo.Size)"
              />
            </div>
            <label>{{ vdo.Name }}</label>
          </div>
          <div class="pnlUploadArea">
            <label>{{ $t('SURREALM.LectureHistory.AddVideo') }}</label>
            <input type="file" id="fileVideo" accept="video/mp4" class="fuClass" @change="UploadVideo" />
          </div>
          <div v-if="VideoList == null || VideoList.lenght == 0" class="NoVideo">
            {{ $t('SURREALM.Video.NoVideo') }}
          </div>
        </div>
      </div>
    </div>
    <DialogVideo :show="dialogVideo.show" :info="dialogVideo.info" @close-dialog="CloseVideo"></DialogVideo>
    <DialogMsg
      :show="dialogShareVideo.show"
      :title="dialogShareVideo.title"
      :msg="dialogShareVideo.msg"
      :isLeftBtnShow="dialogShareVideo.isLeftBtnShow"
      :txtLeftBtn="dialogShareVideo.txtLeftBtn"
      :txtRightBtn="dialogShareVideo.txtRightBtn"
      @close-dialog="CloseShareVideo"
      @click-left="CloseShareVideo"
      @click-right="ShareVideo"
    />
    <DialogMsg
      :show="dialogDelVideo.show"
      :title="dialogDelVideo.title"
      :msg="dialogDelVideo.msg"
      :isLeftBtnShow="dialogDelVideo.isLeftBtnShow"
      :txtLeftBtn="dialogDelVideo.txtLeftBtn"
      :txtRightBtn="dialogDelVideo.txtRightBtn"
      @close-dialog="CloseDeleteVideo"
      @click-left="CloseDeleteVideo"
      @click-right="DeleteVideo"
    />
    <Loading
      :active.sync="loadingInfo.isLoading"
      :can-cancel="false"
      :is-full-page="true"
      :color="loadingInfo.color"
      :opacity="loadingInfo.opacity"
      :background-color="loadingInfo.bgColor"
    ></Loading>
  </div>
</template>
<script>
import { apiGetVideoList, apiUploadVideo, apiShareVideo, apiDeleteVideo } from '@/request.js';
import DialogVideo from '@/components/SURREALM/Backend/DialogVideoTeacher.vue';
import DialogMsg from '@/components/SURREALM/Backend/DialogMsg.vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  name: 'DialogVideoList',
  props: {
    show: Boolean,
    serial: Number,
    lectureName: String,
    usedSize: Number,
  },
  data() {
    return {
      loadingInfo: {
        isLoading: false,
        color: '#fff',
        opacity: 0.9,
        bgColor: '#131217',
      },
      dialogVideo: {
        show: false,
        info: {},
      },
      dialogShareVideo: {
        show: false,
        title: '',
        msg: '',
        isLeftBtnShow: true,
        txtLeftBtn: '',
        txtRightBtn: '',
      },
      dialogDelVideo: {
        show: false,
        title: '',
        msg: '',
        isLeftBtnShow: true,
        txtLeftBtn: '',
        txtRightBtn: '',
      },
      ShareVideoSerial: null,
      DeleteVideoSerial: null,
      DeleteVideoSize: 0,
      VideoList: null,
      MaxSize: 5120,
      CurrentTotalSize: 0,
    };
  },
  watch: {
    show(bool) {
      if (bool) {
        this.GetVideo();
      }
    },
    usedSize(num) {
      this.CurrentTotalSize = num;
    },
  },
  methods: {
    CloseDialog() {
      this.$emit('close-dialog');
    },
    ShowVideo(VideoItem) {
      this.dialogVideo.info = VideoItem;
      this.dialogVideo.show = true;
    },
    CloseVideo() {
      this.dialogVideo.info = {};
      this.dialogVideo.show = false;
    },
    GetVideo() {
      this.VideoList = null;
      apiGetVideoList(this.serial).then((res) => {
        console.log(JSON.stringify(res.data));
        if (res.data.Status == 'ok') {
          if (res.data.VideoList.length > 0) this.VideoList = res.data.VideoList;
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
      // this.VideoList = [
      //   {
      //     Serial: 0,
      //     Name: 'asdasd.mp4',
      //     Url: 'https://surrealm.hlc.edu.tw/SurrealmVideoRecorder/video_20211019083342.mp4',
      //     Share: "T",
      //   },
      // ];
    },
    GetVideoPhoto(Poster) {
      return Poster == '' ? require('@/assets/img/SURREALM/Backend/LectureManager/default_lecture.jpg') : Poster;
    },
    UploadVideo(event) {
      let file = event.target.files[0];
      let size = Math.ceil(file.size / 1024 / 1024); //無條件進位 MB
      let fileExt = file.name.substring(file.name.lastIndexOf('.'));
      //console.log(`UploadVideo size: ${size}MB , fileExt: ${fileExt}`);

      if (fileExt != '.mp4') {
        this.$toasted.show('檔案類型錯誤, 請上傳mp4', {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      } else if (this.CurrentTotalSize + size > this.MaxSize) {
        this.$toasted.show('剩餘儲存空間不足', {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      } else {
        let postforms = new FormData();
        postforms.append('File', file);
        postforms.append('Name', file.name);
        postforms.append('Size', size);
        postforms.append('Serial', this.serial);

        this.loadingInfo.isLoading = true;
        apiUploadVideo(postforms).then((res) => {
          this.loadingInfo.isLoading = false;
          console.log(`apiUploadVideo ${res.data}`);
          if (res.data.Status == 'ok') {
            this.CurrentTotalSize += size;
            this.GetVideo();
            this.$toasted.show('已成功上傳', {
              icon: 'check',
              position: 'bottom-center',
              duration: 3500,
            });
          } else {
            this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
              icon: 'warning',
              position: 'bottom-center',
              duration: 3500,
            });
          }
        });
      }
      document.getElementById('fileVideo').value = '';
    },
    CloseShareVideo() {
      this.ShareVideoSerial = null;
      this.dialogShareVideo.title = '';
      this.dialogShareVideo.msg = '';
      this.dialogShareVideo.isLeftBtnShow = true;
      this.dialogShareVideo.txtLeftBtn = '';
      this.dialogShareVideo.txtRightBtn = '';
      this.dialogShareVideo.show = false;
    },
    ShowShareVideo(Serial, Share) {
      if (Share == 'T') {
        this.$toasted.show('此影片已經分享過', {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      } else {
        this.ShareVideoSerial = Serial;
        this.dialogShareVideo.title = '分享影片';
        this.dialogShareVideo.msg = '是否分享此影片給本堂課所有學員?';
        this.dialogShareVideo.isLeftBtnShow = true;
        this.dialogShareVideo.txtLeftBtn = '否';
        this.dialogShareVideo.txtRightBtn = '是';
        this.dialogShareVideo.show = true;
      }
    },
    ShareVideo() {
      this.loadingInfo.isLoading = true;
      apiShareVideo(this.ShareVideoSerial, {}).then((res) => {
        this.loadingInfo.isLoading = false;
        if (res.data.Status == 'ok') {
          this.$toasted.show('分享成功 ', {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
          this.CloseShareVideo();
          this.GetVideo();
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },
    CloseDeleteVideo() {
      this.DeleteVideoSerial = null;
      this.DeleteVideoSize = 0;
      this.dialogDelVideo.title = '';
      this.dialogDelVideo.msg = '';
      this.dialogDelVideo.isLeftBtnShow = true;
      this.dialogDelVideo.txtLeftBtn = '';
      this.dialogDelVideo.txtRightBtn = '';
      this.dialogDelVideo.show = false;
    },
    ShowDeleteVideo(Serial, Size) {
      this.DeleteVideoSerial = Serial;
      this.DeleteVideoSize = Size;
      this.dialogDelVideo.title = '刪除影片';
      this.dialogDelVideo.msg = '確定要刪除此影片嗎?';
      this.dialogDelVideo.isLeftBtnShow = true;
      this.dialogDelVideo.txtLeftBtn = '否';
      this.dialogDelVideo.txtRightBtn = '是';
      this.dialogDelVideo.show = true;
    },
    DeleteVideo() {
      apiDeleteVideo(this.DeleteVideoSerial).then((res) => {
        if (res.data.Status == 'ok') {
          this.$toasted.show('已刪除影片', {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
          this.CurrentTotalSize -= this.DeleteVideoSize;
          this.CloseDeleteVideo();
          this.GetVideo();
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },
  },
  components: {
    DialogVideo,
    DialogMsg,
    Loading,
  },
};
</script>