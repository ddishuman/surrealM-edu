<template>
  <div id="LectureHistory">
    <Header :title="$t('SURREALM.PageName')" logoutPath="/SURREALM/Login" />
    <Menu />
    <div class="pnlPageContent scrollBar" v-if="LectureSelect == null">
      <TitleBar
        :iconSrc="require('@/assets/img/SURREALM/Backend/Menu/icon_lecture_history.png')"
        :title="$t('SURREALM.ClientLectureHistory.PageName')"
      >
      </TitleBar>
      <div class="lectureHistory">
        <div class="searchTitle">{{ $t('SURREALM.LectureHistory.StartDate') }}</div>
        <Datepicker
          v-model="Search.StartDate"
          :disabled-date="DisableAfterToday"
          format="YYYY-MM-DD"
          value-type="format"
          placeholder="Select date"
          class="searchDate"
        ></Datepicker>
        <div class="searchTitle">{{ $t('SURREALM.LectureHistory.EndDate') }}</div>
        <Datepicker
          v-model="Search.EndDate"
          :disabled-date="DisableAfterToday"
          format="YYYY-MM-DD"
          value-type="format"
          placeholder="Select date"
          class="searchDate"
        ></Datepicker>
        <button class="btnNoBg btnSearch" @click="SearchLecture">{{ $t('SURREALM.LectureHistory.Search') }}</button>
        <div class="infoTitle">
          <div class="infoDate">{{ $t('SURREALM.ClientLectureHistory.Date') }}</div>
          <div class="infoTime">{{ $t('SURREALM.ClientLectureHistory.Time') }}</div>
          <div class="infoClientName">{{ $t('SURREALM.LectureHistory.LectureName') }}</div>
          <div class="infoTeacherName">{{ $t('SURREALM.LectureHistory.TeacherName') }}</div>
          <div class="infoAttend">{{ $t('SURREALM.ClientLectureHistory.Attend') }}</div>
          <div class="infoRecord">{{ $t('SURREALM.LectureHistory.Record') }}</div>
        </div>
        <div class="infoArea">
          <div class="infoItem" v-for="info in Lectures" :key="info.Serial">
            <div class="infoDate" @click="IntoLecture(info.Serial)">{{ info.Date }}</div>
            <div class="infoTime" @click="IntoLecture(info.Serial)">{{ info.Time }}</div>
            <div class="infoClientName" @click="IntoLecture(info.Serial)">{{ info.LectureName }}</div>
            <div class="infoTeacherName" @click="IntoLecture(info.Serial)">{{ info.TeacherName }}</div>
            <div class="infoAttend" v-html="AttendStatus(info.Attend)"></div>
            <div class="infoRecord" @click="DownLoadRecord(info.Serial)">
              <img src="@/assets/img/SURREALM/Backend/LectureManager/icon_download.png" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pnlPageContent scrollBar" v-else>
      <TitleBar
        :iconSrc="require('@/assets/img/SURREALM/Backend/Menu/icon_lecture_history.png')"
        :title="$t('SURREALM.ClientLectureHistory.PageName')"
      >
        <button class="btn" @click="BackList()">{{ $t('SURREALM.LectureHistory.btnBack') }}</button>
      </TitleBar>

      <div class="lectureManager">
        <div class="previewLeft">
          <img :src="LectureSelect.Image" />
          <div class="lectureTitle">{{ LectureSelect.Lecture.Name }}</div>
          <div class="lectureDes">{{ LectureSelect.Lecture.Des }}</div>
        </div>
        <div class="previewRight">
          <div class="infoItem">
            <label class="infoTitle">{{ `${$t('SURREALM.LectureOwn.LectureDate')}` }}</label>
            <label class="infoContent"
              >{{ LectureSelect.Lecture.Date }} <label style="margin-right: 20px"></label>
              {{ `${LectureSelect.Lecture.Time[0]} - ${LectureSelect.Lecture.Time[1]}` }}</label
            >
          </div>
          <div class="infoItem">
            <label class="infoTitle">{{ `${$t('SURREALM.LectureOwn.LectureType')}` }}</label>
            <label class="infoContent">{{ GetRoomName() }}</label>
          </div>
          <div class="infoItem">
            <label class="infoTitle">{{ `${$t('SURREALM.LectureOwn.LectureStream')}` }}</label>
            <label class="infoContent">{{ IsStreamingAllow(LectureSelect.Lecture.IsStreaming) }}</label>
          </div>
          <div class="infoItem">
            <label class="infoTitle">{{ `${$t('SURREALM.LectureHistory.TeacherName')}` }}</label>
            <label class="infoContent">{{ LectureSelect.TeacherName }}</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/js/dateFormat.js';
import Header from '@/components/SURREALM/Client/Header.vue';
import Menu from '@/components/SURREALM/Client/Menu.vue';
import TitleBar from '@/components/SURREALM/Backend/TitleBar.vue';
import Datepicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import {
  apiGetFinishLectureStudent,
  apiStudentGetRecord,
  apiGetFinishLectureDetailStudent,
  apiGetAllLectureType,
} from '@/request.js';

export default {
  data() {
    return {
      Search: {
        StartDate: '',
        EndDate: '',
      },
      Lectures: [],
      LectureSelect: null,
    };
  },
  mounted() {
    //日期預設
    var dtEnd = new Date(Date.now());
    dtEnd.setHours(0, 0, 0);
    var dtStart = new Date(dtEnd);
    dtStart.setDate(dtEnd.getDate() - parseInt(30));
    this.Search.StartDate = dtStart.format('yyyy-MM-dd').toString();
    this.Search.EndDate = dtEnd.format('yyyy-MM-dd').toString();
    this.SearchLecture();
    this.GetLectureType();
  },
  computed: {},
  methods: {
    SearchLecture() {
      let data = {
        startdate: this.Search.StartDate,
        enddate: this.Search.EndDate,
      };
      apiGetFinishLectureStudent(data).then((res) => {
        if (res.data.Status == 'ok') {
          this.Lectures = res.data.Lectures;
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },
    AttendStatus(Attend) {
      return Attend
        ? this.$t('SURREALM.ClientLectureHistory.AttendTrue')
        : "<label style='color:#F65B5B;'>" + this.$t('SURREALM.ClientLectureHistory.AttendFalse') + '</label>';
    },
    DisableAfterToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date > today;
    },
    IntoLecture(Serial) {
      apiGetFinishLectureDetailStudent(Serial).then((res) => {
        if (res.data.Status == 'ok') {
          this.LectureSelect = res.data.LectureSelect;
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },
    DownLoadRecord(Serial) {
      window.open(apiStudentGetRecord + `${localStorage.getItem('Account')}/${Serial}`);
    },
    BackList() {
      this.LectureSelect = null;
    },
    GetLectureType() {
      apiGetAllLectureType().then((res) => {
        if (res.data.Status == 'ok') {
          this.LectureType = res.data.LectureType;
        } else {
          this.LectureType = null;
        }
      });
    },
    GetRoomName() {
      return this.RoomTypeToName(this.LectureType, this.LectureSelect.Lecture.Type);
    },
  },
  components: {
    Header,
    Menu,
    TitleBar,
    Datepicker,
  },
};
</script>