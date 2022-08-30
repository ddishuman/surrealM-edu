<template>
  <div id="Home">
    <Header :title="$t('SURREALM.PageName')" logoutPath="/SURREALM/Login" />
    <Menu />
    <div class="pnlPageContent scrollBar">
      <div class="home">
        <button id="btnAddLecture" class="btnAddLecture" @click="AddLecture">
          {{ $t('SURREALM.LectureOwn.AddLecture') }}
        </button>
        <hr class="homeHr" />
        <div class="SubTitle">{{ $t('SURREALM.LectureOwn.LectureSoon') }}</div>
        <div v-if="FilterLectureNew.length == 0" class="noLectureHint">{{ $t('SURREALM.LectureOwn.NoLectureSoon') }}</div>
        <LectureItem
          v-for="lecture in FilterLectureNew"
          :key="lecture.Serial"
          :LectureInfo="lecture"
          @into-lecture="IntoLecture"
          @show-lecture-code="ShowLectureCode"
          @edit-lecture="EditLecture"
          @show-del="ShowDelLecture"
        />
      </div>
    </div>
    <DialogLectureCode
      :show="dialogLectureCode.show"
      :lectureCode="dialogLectureCode.lectureCode"
      @close-dialog="CloseLectureCodeDialog"
    />
    <DialogMsg
      :show="dialogDelLecture.show"
      :title="dialogDelLecture.title"
      :msg="dialogDelLecture.msg"
      :isLeftBtnShow="dialogDelLecture.isLeftBtnShow"
      :txtLeftBtn="dialogDelLecture.txtLeftBtn"
      :txtRightBtn="dialogDelLecture.txtRightBtn"
      @close-dialog="CloseDelLecture"
      @click-left="CloseDelLecture"
      @click-right="DelLecture"
    ></DialogMsg>
  </div>
</template>

<script>
import Header from '@/components/SURREALM/Backend/Header.vue';
import Menu from '@/components/SURREALM/Backend/Menu.vue';
import LectureItem from '@/components/SURREALM/Backend/LectureItem.vue';
import DialogLectureCode from '@/components/SURREALM/Backend/DialogLectureCode.vue';
import DialogMsg from '@/components/SURREALM/Backend/DialogMsg.vue';
import { apiGetLecture, apiDelLecture } from '@/request.js';

export default {
  mounted() {
    this.GetLectures();
  },
  data() {
    return {
      Lectures: [],
      dialogLectureCode: {
        show: false,
        lectureCode: '',
      },
      dialogDelLecture: {
        show: false,
        title: '',
        msg: '',
        isLeftBtnShow: true,
        txtLeftBtn: '',
        txtRightBtn: '',
      },
      DelLectureSerial: null,
    };
  },
  computed: {
    FilterLectureNew: function () {
      let today = new Date();
      let threeDay = new Date();
      threeDay.setDate(threeDay.getDate() + 3);
      return this.Lectures.filter((obj) => {
        let LectureDate = new Date(obj.Lecture.Date);
        let hours = obj.Lecture.Time[0].split(':')[0];
        let minutes = obj.Lecture.Time[0].split(':')[1];
        LectureDate.setHours(hours);
        LectureDate.setMinutes(minutes);
        return today.getTime() <= LectureDate.getTime() && LectureDate.getTime() <= threeDay.getTime();
      });
    },
  },
  methods: {
    AddLecture() {
      this.$router.push({ path: '/SURREALM/Backend/LectureOwn?add=t' });
    },
    GetLectures() {
      apiGetLecture().then((res) => {
        if (res.data.Status == 'ok') {
          this.Lectures = res.data.Lectures;
          if (this.Lectures.length > 5) {
            this.Lectures.splice(5, this.Lectures.length);
          }
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },
    IntoLecture(Serial) {
      this.$router.push({ path: '/SURREALM/Backend/LectureOwn?into=' + Serial });
    },
    EditLecture(Serial) {
      this.$router.push({ path: '/SURREALM/Backend/LectureOwn?edit=' + Serial });
    },
    CloseLectureCodeDialog() {
      this.dialogLectureCode.show = false;
    },
    ShowLectureCode(LectureCode) {
      this.dialogLectureCode.lectureCode = LectureCode;
      this.dialogLectureCode.show = true;
    },
    CloseDelLecture() {
      this.DelLectureSerial = null;
      this.dialogDelLecture.title = '';
      this.dialogDelLecture.msg = '';
      this.dialogDelLecture.isLeftBtnShow = true;
      this.dialogDelLecture.txtLeftBtn = '';
      this.dialogDelLecture.txtRightBtn = '';
      this.dialogDelLecture.show = false;
    },
    ShowDelLecture(Serial) {
      this.DelLectureSerial = Serial;
      this.dialogDelLecture.title = this.$t('SURREALM.LectureOwn.Warning');
      this.dialogDelLecture.msg = this.$t('SURREALM.LectureOwn.DelMsg');
      this.dialogDelLecture.isLeftBtnShow = true;
      this.dialogDelLecture.txtLeftBtn = this.$t('SURREALM.LectureOwn.DelLeftBtn');
      this.dialogDelLecture.txtRightBtn = this.$t('SURREALM.LectureOwn.DelRightBtn');
      this.dialogDelLecture.show = true;
    },
    DelLecture() {
      apiDelLecture(this.DelLectureSerial).then((res) => {
        if (res.data.Status == 'ok') {
          var Index = this.Lectures.findIndex((obj) => obj.Serial == this.DelLectureSerial);
          this.Lectures.splice(Index, 1);
          this.CloseDelLecture();
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
    Header,
    Menu,
    LectureItem,
    DialogLectureCode,
    DialogMsg,
  },
};
</script>