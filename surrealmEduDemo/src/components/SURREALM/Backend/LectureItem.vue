<template>
  <div class="lectureItem">
    <div class="pnlItemBg" @click.self="IntoLecture">
      <img class="imgLecture" :src="GetImage" @click.self="IntoLecture" />
      <label class="lblLive" v-if="ShowLive()">{{ $t('SURREALM.LectureItem.Live') }}</label>
      <label class="lblLectureName" @click.self="IntoLecture">{{ LectureInfo.Lecture.Name }}</label>
      <label class="lblDate" @click.self="IntoLecture">{{ LecctureDate() }}</label>
      <div class="pnlItemHover" v-if="TeacherHover()">
        <img class="imgHover" src="@/assets/img/SURREALM/Backend/LectureManager/icon_folder_menu.png" />
        <div class="pnlItemTools">
          <img class="imgIconArrow" src="@/assets/img/SURREALM/Backend/LectureManager/icon_arrow_2.png" />
          <div class="btnItemTools imgIconCopy" @click.self="ShowLectureCode">
            {{ $t('SURREALM.LectureItem.ShowLectureCode') }}
          </div>
          <div class="btnItemTools imgIconEdit" @click.self="EditLecture">
            {{ $t('SURREALM.LectureItem.EditLecture') }}
          </div>
          <div class="btnItemTools imgIconDel" @click.self="DelDialog">{{ $t('SURREALM.LectureItem.DelLecture') }}</div>
        </div>
      </div>
      <div class="pnlItemHover" v-else>
        <img class="imgHover" src="@/assets/img/SURREALM/Backend/LectureManager/icon_folder_menu.png" />
        <div class="pnlItemTools">
          <img class="imgIconArrow" src="@/assets/img/SURREALM/Backend/LectureManager/icon_arrow_2.png" />
          <div class="btnItemTools imgIconLive" @click.self="ShowLiveDialog">
            {{ $t('SURREALM.LectureItem.ShowLive') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LectureItem',
  props: {
    LectureInfo: Object,
  },
  data() {
    return {};
  },
  computed: {
    GetImage() {
      let ImgSrc = '';
      if (this.LectureInfo.Lecture.Image == '') {
        ImgSrc = require('@/assets/img/SURREALM/Backend/LectureManager/lecture_default.png');
      } else {
        ImgSrc = this.LectureInfo.Lecture.Image;
      }
      return ImgSrc;
    },
  },
  methods: {
    IntoLecture() {
      this.$emit('into-lecture', this.LectureInfo.Serial);
    },
    ShowLectureCode() {
      this.$emit('show-lecture-code', this.LectureInfo.LectureCode);
    },
    EditLecture() {
      this.$emit('edit-lecture', this.LectureInfo.Serial);
    },
    DelDialog() {
      this.$emit('show-del', this.LectureInfo.Serial);
    },
    ShowLiveDialog() {
      let StartDt = new Date(this.LectureInfo.Lecture.Date);
      let StartTime = this.LectureInfo.Lecture.Time[0].split(':');
      StartDt.setHours(StartTime[0]);
      StartDt.setMinutes(StartTime[1]);
      let EndDt = new Date(this.LectureInfo.Lecture.Date);
      let EndTime = this.LectureInfo.Lecture.Time[1].split(':');
      EndDt.setHours(EndTime[0]);
      EndDt.setMinutes(EndTime[1]);

      let data = {
        StartDt: StartDt,
        EndDt: EndDt,
        LectureTitle: this.LectureInfo.Lecture.Name,
        LectureCode: this.LectureInfo.LectureCode,
        Serial: this.LectureInfo.Serial,
        IsStreaming: this.LectureInfo.Lecture.IsStreaming,
      };
      this.$emit('show-live', data);
    },
    TeacherHover() {
      return this.$router.currentRoute.name.toLowerCase().includes('client') ? false : true;
    },
    ShowLive() {
      let StartDt = new Date(this.LectureInfo.Lecture.Date);
      let StartTime = this.LectureInfo.Lecture.Time[0].split(':');
      StartDt.setHours(StartTime[0]);
      StartDt.setMinutes(StartTime[1]);
      let EndDt = new Date(this.LectureInfo.Lecture.Date);
      let EndTime = this.LectureInfo.Lecture.Time[1].split(':');
      EndDt.setHours(EndTime[0]);
      EndDt.setMinutes(EndTime[1]);

      return this.LectureInfo.Lecture.IsStreaming == 'T' ? this.IsLiveTime(StartDt, EndDt) : false;
    },
    LecctureDate() {
      return this.LectureInfo.Lecture.Date.substring(5).replace('-', '.');
    },
  },
};
</script>