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
            <label>{{ $t('SURREALM.Video.Title') }}</label>
            <img class="btnDialogXX" src="@/assets/img/SURREALM/Backend/btn_close.png" @click="CloseDialog" />
          </div>
          <button class="addTag" @click="AddTag()">新增時間戳記</button>
          <div class="pnlContent">
            <div
              v-for="(Tag, Index) in TimeTag"
              :key="Tag.TagTime"
              class="tagItem"
              @click.self="PlayTimeTag(Tag.TagTime)"
            >
              <label @click.self="PlayTimeTag(Tag.TagTime)">{{ TimeTransform(Tag.TagTime) }}</label>
              <button class="tagDelete" @click.self="ShowDelTag(Index)"></button>
              <button class="tagEdit" @click.self="ShowEditTag(Tag, Index)"></button>
              <div class="tagHover" v-if="Tag.TagNote != ''">{{ HoverText(Tag.TagNote) }}</div>
            </div>
          </div>
          <div class="pnlTools">
            <button class="btnNoBg" @click="CloseDialog()">取消編輯</button>
            <button class="btnNoBg" @click="SubmitTag()">儲存編輯</button>
          </div>
        </div>
      </div>
    </div>

    <DialogMsg
      :show="dialogDelTag.show"
      :title="dialogDelTag.title"
      :msg="dialogDelTag.msg"
      :isLeftBtnShow="dialogDelTag.isLeftBtnShow"
      :txtLeftBtn="dialogDelTag.txtLeftBtn"
      :txtRightBtn="dialogDelTag.txtRightBtn"
      @close-dialog="CloseDelTag"
      @click-left="CloseDelTag"
      @click-right="DeleteTag"
    />
    <DialogTageNote
      :show="dialogTagNote.show"
      :index="dialogTagNote.index"
      :msg="dialogTagNote.msg"
      @close-dialog="CloseEditTag"
      @edit-Note="EditTag"
    />
  </div>
</template>
<script>
import 'video.js/dist/video-js.css';
import { videoPlayer } from 'vue-video-player';
import DialogMsg from '@/components/SURREALM/Backend/DialogMsg.vue';
import DialogTageNote from '@/components/SURREALM/Backend/DialogTageNote.vue';
import { apiGetVideoTags, apiUpdataVideoTags } from '@/request.js';

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
      dialogDelTag: {
        show: false,
        title: '',
        msg: '',
        isLeftBtnShow: true,
        txtLeftBtn: '',
        txtRightBtn: '',
      },
      dialogTagNote: {
        show: false,
        index: null,
        msg: '',
      },
      DelTagIndex: null,
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
    PlayTimeTag(time) {
      this.player.currentTime(time);
    },
    TimeTransform(oriSecond) {
      let minutes = parseInt((oriSecond % 3600) / 60) + '';
      let seconds = (oriSecond % 60) + '';
      return `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    },
    AddTag() {
      let CurrentTime = Math.round(this.$refs.video.player.currentTime());
      let indexOf = this.TimeTag.findIndex((obj) => obj.TagTime == CurrentTime);
      if (indexOf >= 0) {
        this.$toasted.show('此秒數已新增過時間戳記', {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      } else {
        let data = { TagTime: CurrentTime, TagNote: '' };
        this.TimeTag.push(data);
        this.TimeTag.sort((a, b) => (a.TagTime > b.TagTime && 1) || -1);
      }
    },
    HoverText(TagNote) {
      return TagNote.length > 13 ? TagNote.substring(0, 12) + '...' : TagNote;
    },
    CloseDelTag() {
      this.DelTagIndex = null;
      this.dialogDelTag.title = '';
      this.dialogDelTag.msg = '';
      this.dialogDelTag.isLeftBtnShow = true;
      this.dialogDelTag.txtLeftBtn = '';
      this.dialogDelTag.txtRightBtn = '';
      this.dialogDelTag.show = false;
    },
    ShowDelTag(Index) {
      this.DelTagIndex = Index;
      this.dialogDelTag.title = '刪除戳記';
      this.dialogDelTag.msg = '確定要刪除時間戳記?';
      this.dialogDelTag.isLeftBtnShow = true;
      this.dialogDelTag.txtLeftBtn = '否';
      this.dialogDelTag.txtRightBtn = '是';
      this.dialogDelTag.show = true;
    },
    DeleteTag() {
      this.TimeTag.splice(this.DelTagIndex, 1);
      this.CloseDelTag();
    },
    CloseEditTag() {
      this.dialogTagNote.show = false;
      this.dialogTagNote.index = null;
      this.dialogTagNote.msg = '';
    },
    ShowEditTag(Tag, Index) {
      console.log('ShowEditTag');
      this.dialogTagNote.show = true;
      this.dialogTagNote.index = Index;
      this.dialogTagNote.msg = Tag.TagNote;
    },
    EditTag(data) {
      this.TimeTag[data.Index].TagNote = data.Note;
      console.log('EditTag: ' + JSON.stringify(data));
      this.CloseEditTag();
    },
    SubmitTag() {
      let data = {
        serial: this.info.Serial,
        Tags: this.TimeTag,
      };

      console.log('apiUpdataVideoTags data:' + JSON.stringify(data));
      apiUpdataVideoTags(data).then((res) => {
        console.log('apiUpdataVideoTags :' + JSON.stringify(res.data));
        if (res.data.Status == 'ok') {
          this.$toasted.show('已儲存', {
            icon: 'warning',
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
    },
  },
  components: {
    videoPlayer,
    DialogMsg,
    DialogTageNote,
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

.video-js{
  margin: 0 auto;
}
</style>
