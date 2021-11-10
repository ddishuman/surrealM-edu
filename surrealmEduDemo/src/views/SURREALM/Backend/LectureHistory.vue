<template>
  <div id="LectureHistory">
    <Header :title="$t('SURREALM.PageName')" logoutPath="/SURREALM/Login" />
    <Menu />
    <div class="pnlPageContent scrollBar" v-if="LectureSelect == null">
      <TitleBar
        :iconSrc="require('@/assets/img/SURREALM/Backend/Menu/icon_lecture_history.png')"
        :title="$t('SURREALM.LectureHistory.PageName')"
      >
      </TitleBar>
      <div class="lectureHistory">
        <div style="width: 1113px">
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
        </div>

        <div class="infoTitle">
          <div class="infoDate">{{ $t('SURREALM.LectureHistory.Date') }}</div>
          <div class="infoTime">{{ $t('SURREALM.LectureHistory.Time') }}</div>
          <div class="infoName">{{ $t('SURREALM.LectureHistory.LectureName') }}</div>
          <div class="infoAttend">{{ $t('SURREALM.LectureHistory.Attend') }}</div>
          <div class="infoRestart">{{ $t('SURREALM.LectureHistory.ReStart') }}</div>
          <div class="infoRecord">{{ $t('SURREALM.LectureHistory.Record') }}</div>
        </div>
        <div class="infoArea">
          <div class="infoItem" v-for="info in Lectures" :key="info.Serial">
            <div class="infoDate" @click="IntoLecture(info.Serial)">{{ info.Date }}</div>
            <div class="infoTime" @click="IntoLecture(info.Serial)">{{ info.Time }}</div>
            <div class="infoName" @click="IntoLecture(info.Serial)">{{ info.LectureName }}</div>
            <div class="infoAttend" @click="IntoLecture(info.Serial)">
              {{ ` ${info.ActualNumber} / ${info.PeopleNumber}` }}
            </div>
            <div class="infoRestart" @click="ReStartLecture(info.Serial)">
              <img src="@/assets/img/SURREALM/Backend/LectureManager/icon_restart.png" />
            </div>
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
        :title="$t('SURREALM.LectureHistory.PageName')"
      >
        <button class="btn" @click="BackList()">{{ $t('SURREALM.LectureHistory.btnBack') }}</button>
        <button class="btn" @click="ShowDialogPost()">
          {{ $t('SURREALM.LectureOwn.SendPost') }}
        </button>
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
            <label class="infoTitle">{{ `${$t('SURREALM.LectureHistory.AttendAndPeopleNumber')}` }}</label>
            <label class="infoContent">{{ `${LectureSelect.AttendNumber} / ${LectureSelect.PeopleNumber}` }}</label>
          </div>

          <div class="infoItem">
            <label class="infoTitle">{{ `${$t('SURREALM.LectureOwn.StudentList')}` }}</label>
            <div class="studentItems">
              <label
                v-for="item in LectureSelect.Student"
                :key="item.Serial"
                :class="GetStudentAttendStyle(item.Attend)"
                >{{ item.Name }}</label
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <DialogPost
      :show="dialogPost.show"
      :serial="dialogPost.serial"
      :edit="dialogPost.edit"
      :msg="dialogPost.msg"
      @close-dialog="CloseDialogPost"
    />
  </div>
</template>

<script>
import '@/assets/js/dateFormat.js';
import Header from '@/components/SURREALM/Backend/Header.vue';
import Menu from '@/components/SURREALM/Backend/Menu.vue';
import TitleBar from '@/components/SURREALM/Backend/TitleBar.vue';
import Datepicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import DialogPost from '@/components/SURREALM/Backend/DialogPost.vue';
import { apiGetFinishLecture, apiGetFinishLectureDetail, apiCopyLecture, apiTeacherGetRecord } from '@/request.js';

export default {
  data() {
    return {
      Search: {
        StartDate: '',
        EndDate: '',
      },
      Lectures: [],
      LectureSelect: null,
      dialogPost: {
        show: false,
        serial: null,
        edit: true,
        msg: '',
      },
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
  },
  computed: {
  },
  methods: {
    SearchLecture() {
      let data = {
        startdate: this.Search.StartDate,
        enddate: this.Search.EndDate,
      };
      apiGetFinishLecture(data).then((res) => {
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
    DisableAfterToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date > today;
    },
    IntoLecture(Serial) {
      apiGetFinishLectureDetail(Serial).then((res) => {
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
      window.open(apiTeacherGetRecord + Serial);
    },
    ReStartLecture(Serial) {
      apiCopyLecture(Serial, {}).then((res) => {
        if (res.data.Status == 'ok') {
          this.$router.push({ path: '/SURREALM/Backend/LectureOwn?re=' + res.data.Serial });
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },

    BackList() {
      this.LectureSelect = null;
    },
    GetRoomName() {
      let RoomType = this.GetRoomType();
      return RoomType.find((obj) => obj.Type == this.LectureSelect.Lecture.Type).Text;
    },
    GetStudentAttendStyle(bool) {
      return bool ? 'itemAttend' : 'itemUnAttend';
    },
    ShowDialogPost() {
      this.dialogPost.serial = this.LectureSelect.Serial;
      this.dialogPost.show = true;
    },
    CloseDialogPost() {
      this.dialogPost.show = false;
    },
  },
  components: {
    Header,
    Menu,
    TitleBar,
    Datepicker,
    DialogPost,
  },
};
</script>