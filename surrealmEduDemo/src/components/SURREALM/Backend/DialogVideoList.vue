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
          <div class="VideoItem" v-for="(vdo, index) in VideoList" :key="index" @click="ShowVideo(vdo)">
            <img src="@/assets/img/SURREALM/Backend/LectureManager/default_lecture.jpg" />
            <label>{{ vdo.Name }}</label>
          </div>
          <div v-if="VideoList == null || VideoList.lenght == 0" class="NoVideo">
            {{ $t('SURREALM.Video.NoVideo') }}
          </div>
        </div>
      </div>
    </div>
    <DialogVideo :show="dialogVideo.show" :info="dialogVideo.info" @close-dialog="CloseVideo"></DialogVideo>
  </div>
</template>
<script>
import { apiGetVideoList } from '@/request.js';
import DialogVideo from '@/components/SURREALM/Backend/DialogVideo.vue';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  name: 'DialogVideoList',
  props: {
    show: Boolean,
    serial: Number,
    lectureName: String,
  },
  data() {
    return {
      dialogVideo: {
        show: false,
        info: {},
      },
      VideoList: null,
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
  },
  components: {
    DialogVideo,
  },
};
</script>