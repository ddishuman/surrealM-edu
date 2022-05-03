<template>
  <div id="LectureOwn">
    <Header :title="$t('SURREALM.PageName')" logoutPath="/SURREALM/Login" />
    <Menu />
    <div class="pnlPageContent scrollBar" v-if="LectureSelect == null">
      <TitleBar
        :iconSrc="require('@/assets/img/SURREALM/Backend/Menu/icon_lecture_own.png')"
        :title="$t('SURREALM.LectureOwn.PageName')"
      >
        <button ref="btnAddLecture" class="btn" @click="ShowAddLectureDialog">
          {{ $t('SURREALM.LectureOwn.AddLecture') }}
        </button>
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
            @show-lecture-code="ShowLectureCode"
            @edit-lecture="EditLecture"
            @show-del="ShowDelLecture"
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
            @show-lecture-code="ShowLectureCode"
            @edit-lecture="EditLecture"
            @show-del="ShowDelLecture"
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
        <button class="btn" @click="EditLecture(LectureSelect.Serial)">
          {{ $t('SURREALM.LectureOwn.EditLecture') }}
        </button>
        <button class="btn" @click="ShowDialogPost()">
          {{ $t('SURREALM.LectureOwn.SendPost') }}
        </button>
        <!-- <button class="btn" @click="ShowDialogExam()" v-if="CanInsertExam()">
          {{ $t('SURREALM.LectureOwn.SetExam') }}
        </button> -->
      </TitleBar>
      <div class="lectureManager">
        <div class="previewLeft">
          <img :src="LectureSelect.Lecture.Image" />
          <div class="lectureTitle">{{ LectureSelect.Lecture.Name }}</div>
          <div class="lectureDes">{{ LectureSelect.Lecture.Des }}</div>
        </div>
        <div class="previewRight">
          <div class="infoItem">
            <label class="infoTitle">{{ `${$t('SURREALM.LectureOwn.LectureCode')}` }}</label>
            <label class="infoContent">{{ LectureSelect.LectureCode }}</label>
          </div>
          <div class="infoItem">
            <label class="infoTitle">{{ `${$t('SURREALM.LectureOwn.LectureDate')}` }}</label>
            <label class="infoContent"
              >{{ SelectLectureDate }} <label style="margin-right: 20px"></label>
              {{ `${LectureSelect.Lecture.Time[0]} - ${LectureSelect.Lecture.Time[1]}` }}</label
            >
          </div>
          <div class="infoItem">
            <label class="infoTitle">{{ `${$t('SURREALM.LectureOwn.LectureType')}` }}</label>
            <label class="infoContent">{{ GetRoomName() }}</label>
          </div>
          <!-- <div class="infoItem">
            <label class="infoTitle">{{ `${$t('SURREALM.LectureOwn.LectureNum')}` }}</label>
            <label class="infoContent">{{ CalcPeopleMax() }}</label>
          </div> -->
          <!-- <div class="infoItem">
            <label class="infoTitle">{{ `${$t('SURREALM.LectureOwn.LectureAuth')}` }}</label>
            <label class="infoContent">{{ LectureSelect.Lecture.Auth }}</label>
          </div> -->
          <div class="infoItem">
            <label class="infoTitle">{{ `${$t('SURREALM.LectureOwn.LectureStream')}` }}</label>
            <label class="infoContent">{{ IsStreamingAllow(LectureSelect.Lecture.IsStreaming) }}</label>
          </div>
          <div class="infoItem">
            <label class="infoTitle">{{ `${$t('SURREALM.LectureOwn.StudentList')}` }}</label>
            <div class="studentItems">
              <label v-for="item in LectureSelect.Student" :key="item.Serial" class="item">{{ item.Name }}</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <DialogAddLecture
      :show="dialogAddLecture.show"
      :defaultValue="LectureEdit"
      @close-dialog="CloseAddLectureDialog"
      @add="DoneAddLecture"
      @edit="DoneEditLecure"
    />
    <DialogLectureCode
      :show="dialogLectureCode.show"
      :lectureCode="dialogLectureCode.lectureCode"
      @close-dialog="CloseLectureCodeDialog"
    />
    <DialogPost
      :show="dialogPost.show"
      :serial="dialogPost.serial"
      :edit="dialogPost.edit"
      :msg="dialogPost.msg"
      @close-dialog="CloseDialogPost"
    />

    <DialogExam
      :show="dialogExam.show"
      :serial="dialogExam.serial"
      :type="dialogExam.type"
      @close-dialog="CloseDialogExam"
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
import TitleBar from '@/components/SURREALM/Backend/TitleBar.vue';
import DialogAddLecture from '@/components/SURREALM/Backend/DialogAddLecture.vue';
import DialogLectureCode from '@/components/SURREALM/Backend/DialogLectureCode.vue';
import DialogPost from '@/components/SURREALM/Backend/DialogPost.vue';
import DialogExam from '@/components/SURREALM/Backend/DialogExam.vue';
import LectureItem from '@/components/SURREALM/Backend/LectureItem.vue';
import DialogMsg from '@/components/SURREALM/Backend/DialogMsg.vue';
import { apiGetLecture, apiDelLecture, apiGetLectureBySerial, apiGetLectureType } from '@/request.js';

export default {
  mounted() {
    let addLecture = this.GetParameterByName('add');
    if (addLecture == 't') {
      this.$refs.btnAddLecture.click();
    }
    this.GetLectures();

    let ReStartSerial = this.GetParameterByName('re');
    if (ReStartSerial != null && ReStartSerial != '') {
      apiGetLectureBySerial(ReStartSerial).then((res) => {
        if (res.data.Status == 'ok') {
          this.LectureEdit = res.data.Lecture;
          this.ShowAddLectureDialog();
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    }
    this.GetLectureType();
  },
  data() {
    return {
      dialogAddLecture: {
        show: false,
      },
      dialogLectureCode: {
        show: false,
        lectureCode: '',
      },
      dialogPost: {
        show: false,
        serial: null,
        edit: true,
        msg: '',
      },
      dialogExam: {
        show: false,
        serial: null,
        type: null,
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
      Lectures: [],
      LectureSelect: null,
      LectureEdit: null,
    };
  },
  computed: {
    FilterLectureNew: function () {
      let today = new Date();
      let threeDay = new Date();
      threeDay.setDate(threeDay.getDate() + 3);
      return this.Lectures.filter((obj) => {
        let LectureDate = new Date(obj.Lecture.Date);
        let hours = obj.Lecture.Time[1].split(':')[0];
        let minutes = obj.Lecture.Time[1].split(':')[1];
        LectureDate.setHours(hours);
        LectureDate.setMinutes(minutes);
        return today.getTime() <= LectureDate.getTime() && LectureDate.getTime() <= threeDay.getTime();
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
    MountedWorkAfterGetLecture() {
      let IntoLectureSerial = this.GetParameterByName('into');
      if (IntoLectureSerial != null && IntoLectureSerial != '') {
        this.IntoLecture(IntoLectureSerial);
      }

      let EditLectureSerial = this.GetParameterByName('edit');
      if (EditLectureSerial != null && EditLectureSerial != '') {
        this.EditLecture(EditLectureSerial);
      }
    },
    GetLectures() {
      apiGetLecture().then((res) => {
        if (res.data.Status == 'ok') {
          this.Lectures = res.data.Lectures;
          this.MountedWorkAfterGetLecture();
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },
    ShowAddLectureDialog() {
      this.dialogAddLecture.show = true;
    },
    CloseAddLectureDialog() {
      this.dialogAddLecture.show = false;
      this.LectureEdit = null;
    },
    CloseLectureCodeDialog() {
      this.dialogLectureCode.show = false;
    },
    DoneAddLecture() {
      // data
      // this.Lectures.push(data);
      this.GetLectures();
    },
    DoneEditLecure(data) {
      let index = this.Lectures.findIndex((obj) => obj.Serial == data.Serial);
      this.Lectures.splice(index, 1, data);
      this.LectureEdit = null;
      if (this.LectureSelect != null) {
        this.LectureSelect = data;
      }
    },
    IntoLecture(Serial) {
      let index = this.Lectures.findIndex((obj) => obj.Serial == Serial);
      this.LectureSelect = this.Lectures[index];
    },
    ShowLectureCode(LectureCode) {
      this.dialogLectureCode.lectureCode = LectureCode;
      this.dialogLectureCode.show = true;
    },
    EditLecture(Serial) {
      let index = this.Lectures.findIndex((obj) => obj.Serial == Serial);
      this.LectureEdit = this.Lectures[index];
      this.ShowAddLectureDialog();
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
    BackList() {
      this.LectureSelect = null;
    },
    CalcPeopleMax() {
      let RoomType = this.GetRoomType();
      return RoomType.find((obj) => obj.Type == this.LectureSelect.Lecture.Type).Value;
    },
    GetLectureType() {
      apiGetLectureType().then((res) => {
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
    ShowDialogPost() {
      this.dialogPost.serial = this.LectureSelect.Serial;
      this.dialogPost.show = true;
    },
    CloseDialogPost() {
      this.dialogPost.show = false;
    },
    ShowDialogExam() {
      this.dialogExam.serial = this.LectureSelect.Serial;
      this.dialogExam.type = this.LectureSelect.Lecture.Type;
      this.dialogExam.show = true;
    },
    CloseDialogExam() {
      this.dialogExam.serial = null;
      this.dialogExam.type = null;
      this.dialogExam.show = false;
    },
    CanInsertExam() {
      return this.LectureSelect.Lecture.Type == '1001' || this.LectureSelect.Lecture.Type == '1002' ? true : false;
    },
  },
  components: {
    Header,
    Menu,
    TitleBar,
    DialogAddLecture,
    DialogLectureCode,
    LectureItem,
    DialogPost,
    DialogMsg,
    DialogExam,
  },
};
</script>