<template>
  <div class="pnlDialogFull" v-show="show">
    <div class="pnlDialogGray">
      <div class="pnlDialogVideo">
        <div class="VideoArea">
          <video-player
            class="video"
            ref="video"
            :options="playerOptions"
            :playsinline="true"
            v-if="playerOptions.sources[0].src != ''"
          ></video-player>
        </div>
        <div class="TagArea">
          <div class="pnlTitle">
            <label>{{ ShowNote ? '註解' : $t('SURREALM.Video.Title') }}</label>
            <img class="btnDialogXX" src="@/assets/img/SURREALM/Backend/btn_close.png" @click="CloseDialog" />
          </div>
          <div class="pnlContentStudent" v-show="!ShowNote">
            <div
              v-for="Tag in TimeTag"
              :key="Tag.TagTime"
              class="tagItem"
              @click="PlayTimeTag(Tag.TagTime, Tag.TagNote)"
            >
              <label>{{ TimeTransform(Tag.TagTime) }}</label>
              <div class="tagHover" v-if="Tag.TagNote != ''">{{ HoverText(Tag.TagNote) }}</div>
            </div>
          </div>
          <div class="pnlContentStudent" v-show="ShowNote">
            <textarea v-model.trim="Note" class="NoteArea" disabled="false"></textarea>
            <div class="pnlTools">
              <button class="btnNoBg" @click="CloseNote()">關閉註解</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import 'video.js/dist/video-js.css';
import { videoPlayer } from 'vue-video-player';
import { apiGetVideoTags } from '@/request.js';

export default {
  name: 'DialogVideo',
  props: {
    show: Boolean,
    info: Object,
    // {
    //   Serial: 0,
    //   Name: 'asdasd.mp4',
    //   Url: 'https://surrealm.hlc.edu.tw/SurrealmVideoRecorder/video_20211019083342.mp4',
    //   Share: false,
    // },
  },
  data() {
    return {
      playerOptions: {
        height: '480',
        autoplay: false,
        muted: false,
        language: 'en',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [
          {
            type: 'video/mp4',
            src: '',
          },
        ],
        poster: '',
      },
      TimeTag: [],
      ShowNote: false,
      Note: '',
    };
  },
  watch: {
    show(bool) {
      if (bool) {
        this.playerOptions.sources[0].src = this.info.Url;

        apiGetVideoTags(this.info.Serial).then((res) => {
          console.log('apiGetVideoTags:' + JSON.stringify(res.data));
          if (res.data.Status == 'ok') {
            this.TimeTag = res.data.Tags;
          } else {
            this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
              icon: 'warning',
              position: 'bottom-center',
              duration: 3500,
            });
          }
        });
        // this.TimeTag = [
        //   {
        //     TagTime: 5,
        //     TagNote: '第一點這邊學生請多加複習考試會考很重要說三次這邊學生請多加複習考試會考很重要說三次這邊',
        //   },
        //   {
        //     TagTime: 15,
        //     TagNote: '第二點這邊學生請多加複習考試會考很重要說三次這邊學生請多加複習考試會考很重要說三次這邊',
        //   },
        // ];
      }
    },
  },
  computed: {
    player() {
      return this.$refs.video.player;
    },
  },
  methods: {
    CloseDialog() {
      this.playerOptions.sources[0].src = '';
      this.$emit('close-dialog');
    },
    PlayTimeTag(time, note) {
      this.player.currentTime(time);
      if (note != '') {
        this.Note = note;
        this.ShowNote = true;
      }
    },
    CloseNote() {
      this.Note = '';
      this.ShowNote = false;
    },
    TimeTransform(oriSecond) {
      let minutes = parseInt((oriSecond % 3600) / 60) + '';
      let seconds = (oriSecond % 60) + '';
      return `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    },

    HoverText(TagNote) {
      return TagNote.length > 13 ? TagNote.substring(0, 12) + '...' : TagNote;
    },
  },
  components: {
    videoPlayer,
  },
};
</script>
<style>
.video-js .vjs-big-play-button {
  position: relative;
  top: 220px;
  left: auto;
  margin: 0 auto;
}

.video-js .vjs-time-control {
  display: block;
}
.video-js .vjs-remaining-time {
  display: none;
}

.video-js {
  margin: 0 auto;
}
</style>
