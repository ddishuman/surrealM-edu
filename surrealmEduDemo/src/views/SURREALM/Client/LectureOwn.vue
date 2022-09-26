<template>
  <div id="LectureOwn">
    <Header :title="$t('SURREALM.PageName')" logoutPath="/SURREALM/Login" />
    <Menu />
    <div class="pnlPageContent scrollBar" v-if="LectureSelect == null">
      <TitleBar
        :iconSrc="require('@/assets/img/SURREALM/Backend/Menu/icon_lecture_own.png')"
        :title="$t('SURREALM.LectureOwn.PageName')"
      >
      </TitleBar>
      <div class="lectureManager">
        <div class="title">{{ $t('SURREALM.LectureOwn.LectureSoon') }}</div>
        <div v-if="FilterLectureNew.length == 0" class="noLectureHint">
          {{ $t('SURREALM.LectureOwn.NoLectureSoon') }}
        </div>
        <template v-else>
          <LectureItem
            v-for="lecture in FilterLectureNew"
            :key="lecture.Serial"
            :LectureInfo="lecture"
            @into-lecture="IntoLecture"
            @show-live="ShowLiveDialog"
          />
        </template>
        <div style="clear: both"></div>
        <hr class="HrSplit" />
        <div class="title">{{ $t('SURREALM.LectureOwn.LectureLater') }}</div>
        <div v-if="FilterLectureOld.length == 0" class="noLectureHint">
          {{ $t('SURREALM.LectureOwn.NoLectureLater') }}
        </div>
        <template v-else>
          <LectureItem
            v-for="lecture in FilterLectureOld"
            :key="lecture.Serial"
            :LectureInfo="lecture"
            @into-lecture="IntoLecture"
            @show-live="ShowLiveDialog"
          />
        </template>
      </div>
    </div>
    <div class="pnlPageContent scrollBar" v-else>
      <TitleBar
        :iconSrc="require('@/assets/img/SURREALM/Backend/Menu/icon_lecture_own.png')"
        :title="LectureSelect.Lecture.Name"
      >
        <button class="btn" @click="BackList()">
          {{ $t('SURREALM.LectureOwn.BtnBack') }}
        </button>
        <button class="btn" @click="WatchLive()">
          {{ $t('SURREALM.LectureItem.ShowLive') }}
        </button>
      </TitleBar>
      <div class="lectureManager">
        <div class="previewLeft">
          <img :src="LectureSelect.Lecture.Image" />
          <div class="lectureTitle">{{ LectureSelect.Lecture.Name }}</div>
          <div class="lectureDes">{{ LectureSelect.Lecture.Des }}</div>
        </div>
        <div class="previewRight">
          <div class="infoItem">
            <label class="infoTitle">{{ `${$t('SURREALM.LectureOwn.LectureDate')}` }}</label>
            <label class="infoContent"
              >{{ SelectLectureDate }} <label style="margin-right: 20px"></label>
              {{ `${LectureSelect.Lecture.Time[0]} - ${LectureSelect.Lecture.Time[1]}` }}</label
            >
          </div>
          <div class="infoItem">
            <label class="infoTitle">{{ `${$t('SURREALM.LectureHistory.TeacherName')}` }}</label>
            <label class="infoContent">{{ LectureSelect.Lecture.TeacherName }}</label>
          </div>
          <div class="infoItem">
            <label class="infoTitle">{{ `${$t('SURREALM.LectureOwn.LectureType')}` }}</label>
            <label class="infoContent">{{ GetRoomName() }}</label>
          </div>
          <div class="infoItem">
            <label class="infoTitle">{{ `${$t('SURREALM.LectureOwn.LectureStream')}` }}</label>
            <label class="infoContent">{{ IsStreamingAllow(LectureSelect.Lecture.IsStreaming) }}</label>
          </div>
          <!-- <div class="infoItem">
            <label class="infoTitle">{{ `${$t('SURREALM.LectureOwn.LectureNum')}` }}</label>
            <label class="infoContent">{{ CalcPeopleMax() }}</label>
          </div> -->
          <!-- <div class="infoItem">
            <label class="infoTitle">{{ `${$t('SURREALM.LectureOwn.LectureAuth')}` }}</label>
            <label class="infoContent">{{ LectureSelect.Lecture.Auth }}</label>
          </div> -->
        </div>
      </div>
    </div>

    <DialogLive
      :show="dialogLive.show"
      :title="dialogLive.lectureTitle"
      :serial="dialogLive.serial"
      :code="dialogLive.lectureCode"
      @close-dialog="CloseLiveDialog"
    ></DialogLive>
  </div>
</template>

<script>
import Header from '@/components/SURREALM/Client/Header.vue';
import Menu from '@/components/SURREALM/Client/Menu.vue';
import TitleBar from '@/components/SURREALM/Backend/TitleBar.vue';
import LectureItem from '@/components/SURREALM/Backend/LectureItem.vue';
import DialogLive from '@/components/SURREALM/Backend/DialogLive.vue';
import { apiGetLectureStudent, apiGetAllLectureType } from '@/request.js';

export default {
  mounted() {
    this.GetLectures();
    this.GetLectureType();
  },
  data() {
    return {
      dialogLive: {
        show: false,
        lectureTitle: '',
        serial: null,
        lectureCode: '',
      },
      Lectures: [],
      LectureSelect: null,
      LectureType: null,
    };
  },
  computed: {
    FilterLectureNew: function () {
      let threeDay = new Date();
      threeDay.setDate(threeDay.getDate() + 3);
      return this.Lectures.filter((obj) => {
        let LectureDate = new Date(obj.Lecture.Date);
        let hours = obj.Lecture.Time[0].split(':')[0];
        let minutes = obj.Lecture.Time[0].split(':')[1];
        LectureDate.setHours(hours);
        LectureDate.setMinutes(minutes);
        return LectureDate.getTime() <= threeDay.getTime();
      });
    },
    FilterLectureOld: function () {
      let threeDay = new Date();
      threeDay.setDate(threeDay.getDate() + 3);
      return this.Lectures.filter((obj) => {
        let LectureDate = new Date(obj.Lecture.Date);
        return LectureDate.getTime() > threeDay.getTime();
      });
    },
    SelectLectureDate: function () {
      return this.LectureSelect == null ? '' : this.LectureSelect.Lecture.Date.replaceAll('-', '.');
    },
  },
  methods: {
    GetLectures() {
      apiGetLectureStudent().then((res) => {
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
    IntoLecture(Serial) {
      let index = this.Lectures.findIndex((obj) => obj.Serial == Serial);
      this.LectureSelect = this.Lectures[index];
    },
    BackList() {
      this.LectureSelect = null;
    },
    CalcPeopleMax() {
      let RoomType = this.GetRoomType();
      return RoomType.find((obj) => obj.Type == this.LectureSelect.Lecture.Type).Value;
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
    WatchLive() {
      let StartDt = new Date(this.LectureSelect.Lecture.Date);
      let StartTime = this.LectureSelect.Lecture.Time[0].split(':');
      StartDt.setHours(StartTime[0]);
      StartDt.setMinutes(StartTime[1]);
      let EndDt = new Date(this.LectureSelect.Lecture.Date);
      let EndTime = this.LectureSelect.Lecture.Time[1].split(':');
      EndDt.setHours(EndTime[0]);
      EndDt.setMinutes(EndTime[1]);

      let data = {
        StartDt: StartDt,
        EndDt: EndDt,
        LectureTitle: this.LectureSelect.Lecture.Name,
        LectureCode: this.LectureSelect.LectureCode,
        Serial: this.LectureSelect.Serial,
        IsStreaming: this.LectureSelect.Lecture.IsStreaming,
      };
      this.ShowLiveDialog(data);
    },
    ShowLiveDialog(data) {
      let bool = this.IsLiveTime(data.StartDt, data.EndDt);
      if (data.IsStreaming != 'T') {
        this.$toasted.show(this.$t('SURREALM.LIVE.Err.NotAllow'), {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      } else if (bool) {
        this.dialogLive.show = true;
        this.dialogLive.lectureTitle = data.LectureTitle;
        this.dialogLive.lectureCode = data.LectureCode;
        this.dialogLive.serial = data.Serial;
      } else {
        this.$toasted.show(this.$t('SURREALM.LIVE.Err.NotStart'), {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      }
    },
    CloseLiveDialog() {
      this.dialogLive.show = false;
      this.dialogLive.lectureTitle = '';
      this.dialogLive.serial = null;
    },
  },
  components: {
    Header,
    Menu,
    TitleBar,
    LectureItem,
    DialogLive,
  },
};
</script>