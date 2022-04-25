<template>
  <div class="pnlDialogFull" v-if="show" style="">
    <div class="pnlDialogGray">
      <!-- @click.self="CloseDialog" -->
      <div class="pnlDialogAddLecture">
        <div class="pnlTitle">
          <label v-show="CurrentStep == 1">{{ $t('SURREALM.LectureOwn.AddDialogTitle1') }}</label>
          <label v-show="CurrentStep == 2">{{ $t('SURREALM.LectureOwn.AddDialogTitle2') }}</label>
          <label v-show="CurrentStep == 3">{{ $t('SURREALM.LectureOwn.AddDialogTitle3') }}</label>
          <label v-show="CurrentStep == 4">{{ $t('SURREALM.LectureOwn.AddDialogTitle4') }}</label>
          <label v-show="CurrentStep == 5">{{ $t('SURREALM.LectureOwn.AddDialogTitle5') }}</label>
          <label v-show="CurrentStep == 6">{{ $t('SURREALM.LectureOwn.AddDialogTitle6') }}</label>
          <img class="btnDialogXX" src="@/assets/img/SURREALM/Backend/btn_close.png" @click="CloseDialog" />
        </div>
        <div class="pnlContent">
          <div class="step1" v-show="CurrentStep == 1">
            <div class="keyinTitle">{{ $t('SURREALM.LectureOwn.LectureName') }}</div>
            <div class="keyinContent">
              <input
                class="lectureName"
                type="text"
                maxlength="30"
                v-model.trim="Lecture.Name"
                :placeholder="$t('SURREALM.LectureOwn.Placeholder.Name')"
              />
            </div>
            <div class="keyinTitle">{{ $t('SURREALM.LectureOwn.LectureDate') }}</div>
            <div class="keyinContent">
              <Datepicker
                v-model="Lecture.Date"
                :disabled-date="DisableBeforeToday"
                format="YYYY-MM-DD"
                value-type="format"
                placeholder="Select date"
                class="lectureDate"
              ></Datepicker>
            </div>
            <div class="keyinTitle">{{ $t('SURREALM.LectureOwn.LectureStartTime') }}</div>
            <div class="keyinSubContent">
              <Datepicker
                v-model="Lecture.Time[0]"
                format="HH:mm"
                value-type="format"
                placeholder="Select time"
                type="time"
                class="lectureTime"
                @change="StartTimeChange"
              ></Datepicker>
            </div>
            <div class="keyinTitle">{{ $t('SURREALM.LectureOwn.LectureEndTime') }}</div>
            <div class="keyinSubContent">
              <Datepicker
                v-model="Lecture.Time[1]"
                format="HH:mm"
                value-type="format"
                placeholder="Select time"
                type="time"
                class="lectureTime"
              ></Datepicker>
            </div>
            <label class="hintUTC">(UTC+8)</label>
            <div class="keyinTitle">{{ $t('SURREALM.LectureOwn.LectureType') }}</div>
            <div class="keyinContent">
              <select v-model="Lecture.Type" class="lectureType">
                <option v-for="option in TypeOptions" :key="option.Text" :value="option.Type">
                  {{ option.Text }}
                </option>
              </select>
              <div class="peopleMax">{{ `${this.$t('SURREALM.LectureOwn.PeopleMax')} ${PeopleMax}` }}</div>
            </div>
            <div class="keyinTitle">{{ $t('SURREALM.LectureOwn.LectureAuth') }}</div>
            <div class="keyinSubContent lectureAuth">
              <!-- <input type="radio" id="public" value="public" v-model="Lecture.Auth" />
              <label for="public"><span></span>{{ $t('SURREALM.LectureOwn.Public') }}</label> -->
              <input type="radio" id="private" value="private" v-model="Lecture.Auth" />
              <label for="private"><span></span>{{ $t('SURREALM.LectureOwn.Private') }}</label>
              <!-- <input type="radio" id="check" value="check" v-model="Lecture.Auth" />
              <label for="check"><span></span>{{ $t('SURREALM.LectureOwn.NeedAuth') }}</label> -->
            </div>
            <div class="keyinTitle">
              {{ $t('SURREALM.LectureOwn.LectureStream') }}
              <div class="hintIconArea">
                <img class="hintIcon" src="@/assets/img/SURREALM/Backend/LectureManager/icon_hint.png" />
                <div class="hintTxt">{{ $t('SURREALM.LectureOwn.AllowHint') }}</div>
              </div>
            </div>
            <div class="keyinSubContent lectureStream">
              <input type="checkbox" id="Stream" v-model="Lecture.IsStreaming" />
              <label for="Stream"><span></span>{{ $t('SURREALM.LectureOwn.AllowStream') }}</label>
            </div>
            <div class="keyinTitle">{{ $t('SURREALM.LectureOwn.LectureDes') }}</div>
            <div class="keyinContent">
              <textarea
                v-model="Lecture.Des"
                class="lectureDes"
                :placeholder="$t('SURREALM.LectureOwn.Placeholder.Des')"
              ></textarea>
            </div>
          </div>
          <div class="step2" v-show="CurrentStep == 2">
            <div class="keyinTitle">{{ $t('SURREALM.LectureOwn.TagFilter') }}</div>
            <select v-model="Student.Tag" class="studentTag" @change="GetStudent(Student.Tag)">
              <option v-for="option in TagOptions" :key="option.Serial" :value="option.Serial">
                {{ option.Name }}
              </option>
            </select>
            <input
              class="studentKeyword"
              type="text"
              v-model.trim="Student.Keyword"
              :placeholder="$t('SURREALM.LectureOwn.Placeholder.StudentName')"
            />
            <div style="clear: both"></div>
            <div class="keyinTitle">{{ $t('SURREALM.LectureOwn.SelectStudent') }}</div>
            <button class="btn" @click="SelectAllStudent">{{ $t('SURREALM.LectureOwn.SelectALL') }}</button>
            <button class="btn" @click="RemoveAllStudent">{{ $t('SURREALM.LectureOwn.RemoveAll') }}</button>
            <label class="selectedNumber">{{
              `${$t('SURREALM.LectureOwn.SelectedNumber')} ${Student.Select.length} / ${PeopleMax}`
            }}</label>
            <div style="clear: both"></div>
            <div class="fliterArea">
              <div
                class="btnFilterStudent"
                v-for="StudentItem in FilterStudentList"
                :key="StudentItem.Serial"
                @click="AddStudent(StudentItem)"
              >
                <label>{{ StudentItem.Name }}</label>
                <img src="@/assets/img/SURREALM/Backend/LectureManager/icon_add.png" />
                <div class="hoverNickName">
                  {{ `${$t('SURREALM.StudentManager.StudentNickName')}: ${StudentItem.Nickname}` }}
                </div>
              </div>
            </div>
            <div class="selectedArea">
              <div
                class="btnSelectedStudent"
                v-for="(StudentItem, index) in Student.Select"
                :key="StudentItem.Serial"
                @click="RemoveStudent(index)"
              >
                <label>{{ StudentItem.Name }}</label>
                <img src="@/assets/img/SURREALM/Backend/LectureManager/icon_remove.png" />
                <!-- <div class="hoverNickName">
                  {{ `${$t('SURREALM.StudentManager.StudentNickName')}: ${StudentItem.Nickname}` }}
                </div> -->
              </div>
            </div>
          </div>
          <div class="step3" v-show="CurrentStep == 3">
            <div class="uploadArea">
              <label class="stepHint">{{ $t('SURREALM.LectureOwn.UpLinkStep1') }}</label>
              <label class="stepLine"></label>
              <label class="stepHint">{{ $t('SURREALM.LectureOwn.UpLinkStep2') }}</label>
              <label class="stepLine"></label>
              <label class="stepHint">{{ $t('SURREALM.LectureOwn.UpLinkStep3') }}</label>
              <input
                class="editLink"
                type="text"
                v-model.trim="Link.Upload.Url"
                :placeholder="$t('SURREALM.LectureOwn.Placeholder.Link')"
              />
              <input
                class="editName"
                type="text"
                v-model.trim="Link.Upload.Name"
                :placeholder="$t('SURREALM.LectureOwn.Placeholder.LinkName')"
              />
              <button class="btn btnUpload" @click="UploadLink">{{ $t('SURREALM.LectureOwn.Upload') }}</button>
            </div>
            <div class="fileArea">
              <div class="titleName">{{ $t('SURREALM.LectureOwn.UpLinkTitleName') }}</div>
              <div class="titleDate">{{ $t('SURREALM.LectureOwn.UpLinkTitleDate') }}</div>
              <div class="titleDel">{{ $t('SURREALM.LectureOwn.UpLinkTitleDel') }}</div>
              <div class="scrollArea">
                <div v-for="(LinkItem, index) in Link.Links" :key="LinkItem.Serial">
                  <a class="titleName" :href="LinkItem.Url" target="blank">{{ LinkItem.Name }}</a>
                  <div class="titleDate">{{ LinkItem.Date }}</div>
                  <button class="titleDel" @click="ShowDelLinkDialog(LinkItem, index)"></button>
                </div>
              </div>
            </div>
          </div>
          <div class="step4" v-show="CurrentStep == 4">
            <CropperView :defaultImage="DefaultImage" @set-image="SetImage" />
          </div>
          <div class="step5" v-show="CurrentStep == 5">
            <label class="title">{{ $t('SURREALM.LectureOwn.LastStepTitle') }}</label>
            <img :src="Lecture.Image" />
            <div class="lectureArea">
              <label class="lectureTitle">{{ Lecture.Name }}</label>
              <div class="infoItem">
                <label class="infoTitle">{{ `${$t('SURREALM.LectureOwn.LectureDate')}` }}</label>
                <label class="infoContent">{{ `${Lecture.Date} ${Lecture.Time[0]} - ${Lecture.Time[1]}` }}</label>
              </div>
              <div class="infoItem">
                <label class="infoTitle">{{ `${$t('SURREALM.LectureOwn.LectureType')}` }}</label>
                <label class="infoContent">{{ RoomTypeToText(Lecture.Type) }}</label>
              </div>
              <div class="infoItem">
                <label class="infoTitle">{{ `${$t('SURREALM.LectureOwn.LectureNum')}` }}</label>
                <label class="infoContent">{{ PeopleMax }}</label>
              </div>
              <!-- <div class="infoItem">
                <label class="infoTitle">{{ `${$t('SURREALM.LectureOwn.LectureAuth')}` }}</label>
                <label class="infoContent">{{ Lecture.Auth }}</label>
              </div> -->
            </div>
          </div>
          <button class="btnPreStep" @click="PreStep" v-show="CurrentStep != 1">
            {{ $t('SURREALM.LectureOwn.PreStep') }}
          </button>
          <button class="btnNextStep" @click="NextStep">
            {{ CurrentStep == 6 ? $t('SURREALM.LectureOwn.Release') : $t('SURREALM.LectureOwn.NextStep') }}
          </button>
        </div>
      </div>
    </div>

    <DialogMsg
      :show="dialogDelLink.show"
      :title="dialogDelLink.title"
      :msg="dialogDelLink.msg"
      :isLeftBtnShow="dialogDelLink.isLeftBtnShow"
      :txtLeftBtn="dialogDelLink.txtLeftBtn"
      :txtRightBtn="dialogDelLink.txtRightBtn"
      @close-dialog="CloseDelLinkDialog"
      @click-left="CloseDelLinkDialog"
      @click-right="DelLink"
    ></DialogMsg>

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
import '@/assets/js/dateFormat.js';
import Datepicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import CropperView from '@/components/SURREALM/Backend/CropperView.vue';
import DialogMsg from '@/components/SURREALM/Backend/DialogMsg.vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import {
  apiGetTag,
  apiGetStudentDetailByTag,
  apiAddLink,
  apiGetLink,
  apiDelLink,
  apiAddLecture,
  apiUpdateLecture,
  apiGetLectureType,
} from '@/request.js';

export default {
  name: 'DialogAddLecture',
  props: {
    show: Boolean,
    defaultValue: Object,
  },
  data() {
    return {
      loadingInfo: {
        isLoading: false,
        color: '#fff',
        opacity: 0.9,
        bgColor: '#131217',
      },
      dialogDelLink: {
        show: false,
        title: '',
        msg: '',
        isLeftBtnShow: true,
        txtLeftBtn: '',
        txtRightBtn: '',
      },
      ModelMaxNum: 6,
      CurrentStep: 1,
      Lecture: {
        Name: '',
        Date: '',
        Time: [],
        Type: '',
        Auth: 'private',
        IsStreaming: false,
        Des: '',
        Image: '',
        Models: [],
      },
      Edu: {
        MaxNumber: 80,
        CurrentNumber: 0,
      },
      Student: {
        Data: [],
        Tag: -1,
        Select: [],
        Keyword: '',
      },
      Link: {
        Upload: {
          Url: '',
          Name: '',
        },
        Links: [],
      },
      Image: {
        ChangePhoto: false,
        Src: '',
      },
      DefaultImage: null,
      Serial: null,
      LectureCode: '',
      TagOptions: [],
      TypeOptions: null,
      DelLinkInfo: {
        Serial: null,
        Index: null,
      },
    };
  },
  mounted() {
    this.GetStudent(this.Student.Tag);
    this.GetLinks();
    this.GetTags();
    this.TypeOptions = this.GetRoomType();
    //TODO IAN K爸換好API後要換成
    //this.TypeOptions = this.GetLectureType();
  },
  computed: {
    PeopleMax: function () {
      return this.TypeOptions == null ? 0 : this.TypeOptions.find((obj) => obj.Type == this.Lecture.Type).Value;
    },
    FilterStudentList: function () {
      if (this.Student.Keyword != '') {
        return this.Student.Data.filter((s) => {
          let Name = s.Name.toLowerCase();
          let Keyword = this.Student.Keyword.toLowerCase();
          return Name.indexOf(Keyword) != -1;
        });
      } else {
        return this.Student.Data;
      }
    },
    CalcSelectModelNum: function () {
      return this.Lecture.Models == null ? this.ModelMaxNum : this.ModelMaxNum - this.Lecture.Models.length;
    },
  },
  watch: {
    defaultValue(obj) {
      if (obj != null) {
        this.Lecture = this.DeepCopy(obj.Lecture);
        this.Student.Select = this.DeepCopy(obj.Student);
        this.Serial = obj.Serial;
        this.LectureCode = obj.LectureCode;
      }
    },
    show(bool) {
      if (!bool) {
        this.Lecture = { Name: '', Date: '', Time: [], Type: '', Auth: 'private', Des: '', Image: '', Models: [] };
        this.Student.Select = [];
        this.Serial = null;
        this.LectureCode = '';
      }
    },
  },
  methods: {
    CloseDialog() {
      this.CurrentStep = 1;
      this.DefaultImage = null;
      this.$emit('close-dialog');
    },
    DisableBeforeToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    },
    // DisableBeforeCurrentTime(date) {
    //   return date < new Date();
    // },
    StartTimeChange() {
      if (this.Lecture.Time.length == 1 || this.Lecture.Time[1] == null) {
        this.Lecture.Time[1] = this.Lecture.Time[0];
      } else {
        let StartTime = new Date(`${this.Lecture.Date} ${this.Lecture.Time[0]}`);
        let EndTime = new Date(`${this.Lecture.Date} ${this.Lecture.Time[1]}`);
        if (StartTime.getTime() > EndTime.getTime()) {
          this.Lecture.Time[1] = this.Lecture.Time[0];
        }
      }
    },
    PreStep() {
      if (this.CurrentStep > 1) {
        if (this.CurrentStep == 3 && this.Lecture.Type != '200') {
          this.CurrentStep = 1;
        } else {
          this.CurrentStep--;
        }
      }
    },
    NextStep() {
      if (this.CurrentStep == 1) {
        let errMsg = this.CheckStep1Info();
        if (errMsg == '') {
          //TODO API GET學校最大連線數&目前時段已預約人數
          // Params: Date, StartTime, EndTimer
          // EX: "2022-04-28", "04:00", "09:00"
          this.Edu.MaxNumber = 80;
          this.Edu.CurrentNumber = 60;

          this.CurrentStep++;
        } else {
          this.$toasted.show(errMsg, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      } else if (this.CurrentStep == 2) {
        let errMsg = this.CheckStep2Info();
        if (errMsg == '') {
          this.CurrentStep++;
        } else {
          this.$toasted.show(errMsg, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      } else if (this.CurrentStep == 3) {
        if (this.Lecture.Image == '') {
          this.GetDefaultImage(this.GetDefaultImageCallback);
        } else {
          this.DefaultImage = this.Lecture.Image;
        }
        this.CurrentStep++;
      } else if (this.CurrentStep == 4) {
        let errMsg = this.CheckStep4Info();
        if (errMsg == '') {
          this.CurrentStep++;
        } else {
          this.$toasted.show(errMsg, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      } else if (this.CurrentStep == 5) {
        let data = {
          Student: this.Student.Select,
          Lecture: this.Lecture,
        };
        this.loadingInfo.isLoading = true;
        if (this.defaultValue != null) {
          let tmpImage = data.Lecture.Image;
          //Updata沒換過圖不重複上傳
          data.Lecture.Image = this.Image.ChangePhoto ? data.Lecture.Image : '';
          data.Serial = this.Serial;
          data.LectureCode = this.LectureCode;
          //TODO API /lecture (patch) data 會多帶 Lecture.IsStreaming
          apiUpdateLecture(data).then((res) => {
            this.loadingInfo.isLoading = false;
            if (res.data.Status == 'ok') {
              //把圖補回來
              if (data.Lecture.Image == '') {
                data.Lecture.Image = tmpImage;
              }
              this.$emit('edit', data);
            } else {
              this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
                icon: 'warning',
                position: 'bottom-center',
                duration: 3500,
              });
            }
            this.Image.ChangePhoto = false;
            this.CloseDialog();
          });
        } else {
          //TODO API /lecture (post) data 會多帶 Lecture.IsStreaming
          apiAddLecture(data).then((res) => {
            this.loadingInfo.isLoading = false;
            if (res.data.Status == 'ok') {
              data.Serial = res.data.Serial;
              data.LectureCode = res.data.LectureCode;
              this.$emit('add', data);
            } else {
              this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
                icon: 'warning',
                position: 'bottom-center',
                duration: 3500,
              });
            }
            this.Image.ChangePhoto = false;
            this.CloseDialog();
          });
        }
      }
    },
    CheckStep1Info() {
      let errMsg = '';
      if (this.Lecture.Name == '') {
        errMsg = this.$t('SURREALM.LectureOwn.Err.Name');
      } else if (this.Lecture.Date == '' || this.Lecture.Date == null) {
        errMsg = this.$t('SURREALM.LectureOwn.Err.Date');
      } else if (this.Lecture.Time[0] == null) {
        errMsg = this.$t('SURREALM.LectureOwn.Err.Time');
      } else if (this.Lecture.Time[1] == null) {
        errMsg = this.$t('SURREALM.LectureOwn.Err.Time');
      } else if (this.Lecture.Type == '') {
        errMsg = this.$t('SURREALM.LectureOwn.Err.Type');
      } else if (this.Lecture.Auth == '') {
        errMsg = this.$t('SURREALM.LectureOwn.Err.Auth');
      } else if (this.Lecture.Des.length < 10) {
        errMsg = this.$t('SURREALM.LectureOwn.Err.Des');
      }

      // if (this.Lecture.Time.length != 0 && this.Lecture.Time[0] != null) {
      //   let LectureDate = new Date(this.Lecture.Date);
      //   let hours = this.Lecture.Time[0].split(':')[0];
      //   let minutes = this.Lecture.Time[0].split(':')[1];
      //   LectureDate.setHours(hours);
      //   LectureDate.setMinutes(minutes);
      //   LectureDate.setSeconds(0);
      //   LectureDate.setMilliseconds(0);
      //   let CurrentDate = new Date();
      //   CurrentDate.setSeconds(0);
      //   CurrentDate.setMilliseconds(0);
      //   if (LectureDate.getTime() < CurrentDate.getTime()) {
      //     errMsg = this.$t('SURREALM.LectureOwn.Err.StartTimeErr');
      //   }
      // }

      if (this.Lecture.Time.length != 0 && this.Lecture.Time[0] != null && this.Lecture.Time[1] != null) {
        let StartTime = new Date(`${this.Lecture.Date} ${this.Lecture.Time[0]}`);
        let EndTime = new Date(`${this.Lecture.Date} ${this.Lecture.Time[1]}`);
        let CurrentDate = new Date();
        if (StartTime.getTime() > EndTime.getTime()) {
          errMsg = this.$t('SURREALM.LectureOwn.Err.EndTimeErr');
        } else if (CurrentDate.getTime() > EndTime.getTime()) {
          errMsg = this.$t('SURREALM.LectureOwn.Err.EndTimeErr2');
        }
      }
      return errMsg;
    },
    CheckStep2Info() {
      let errMsg = '';
      if (this.Student.Select.length == 0) {
        errMsg = this.$t('SURREALM.LectureOwn.Err.StudentLength');
      } else if (this.Student.Select.length > this.PeopleMax) {
        errMsg = this.$t('SURREALM.LectureOwn.Err.OverMax');
      }
      return errMsg;
    },
    CheckStep4Info() {
      let errMsg = '';
      if (this.Lecture.Image == '') {
        errMsg = this.$t('SURREALM.LectureOwn.Err.NullImage');
      }
      return errMsg;
    },
    GetTags() {
      apiGetTag().then((res) => {
        if (res.data.Status == 'ok') {
          let allTag = [{ Serial: -1, Name: this.$t('SURREALM.Tags.TagAll') }];
          if (res.data.TagOptions != null) {
            this.TagOptions = allTag.concat(res.data.TagOptions);
          } else {
            this.TagOptions = allTag;
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
    //TODO API /lecturetype (get)
    //企業版已經有的 教育版也要新增 
    GetLectureType() {
      apiGetLectureType().then((res) => {
        if (res.data.Status == 'ok') {
          this.TypeOptions = res.data.LectureType;
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },
    GetStudent(tag) {
      apiGetStudentDetailByTag(tag).then((res) => {
        if (res.data.Status == 'ok') {
          this.Student.Data = res.data.Student;
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },
    AddStudent(StudentItem) {
      let IndexOf = this.Student.Select.findIndex((Itme) => Itme.Serial == StudentItem.Serial);

      if (this.Student.Select.length >= this.PeopleMax) {
        this.$toasted.show(this.$t('SURREALM.LectureOwn.Err.MaxStudent'), {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      } else if (IndexOf >= 0) {
        this.$toasted.show(this.$t('SURREALM.LectureOwn.Err.AddRepeat'), {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      } else {
        this.Student.Select.push(StudentItem);
      }
    },
    RemoveStudent(index) {
      this.Student.Select.splice(index, 1);
    },
    SelectAllStudent() {
      for (let i = 0; i < this.FilterStudentList.length; i++) {
        let IndexOf = this.Student.Select.findIndex((Itme) => Itme.Serial == this.FilterStudentList[i].Serial);
        if (this.Student.Select.length < this.PeopleMax && IndexOf < 0) {
          this.Student.Select.push(this.FilterStudentList[i]);
        } else if (this.Student.Select.length >= this.PeopleMax) {
          break;
        }
      }
    },
    RemoveAllStudent() {
      this.Student.Select = [];
    },
    GetLinks() {
      apiGetLink().then((res) => {
        if (res.data.Status == 'ok') {
          this.Link.Links = res.data.Links;
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },
    CheckUploadLink() {
      let errMsg = '';
      if (this.Link.Upload.Url == '') {
        errMsg = this.$t('SURREALM.LectureOwn.Placeholder.Link');
      } else if (this.Link.Upload.Name == '') {
        errMsg = this.$t('SURREALM.LectureOwn.Placeholder.LinkName');
      }
      return errMsg;
    },
    UploadLink() {
      let ErrMsg = this.CheckUploadLink();
      if (ErrMsg == '') {
        let data = {
          Url: this.Link.Upload.Url,
          Name: this.Link.Upload.Name,
        };
        apiAddLink(data).then((res) => {
          if (res.data.Status == 'ok') {
            data.Serial = res.data.Serial;
            var dtNow = new Date(Date.now());
            data.Date = dtNow.format('yyyy-MM-dd').toString();
            this.Link.Links.push(data);
            this.Link.Upload.Url = '';
            this.Link.Upload.Name = '';
          } else {
            this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
              icon: 'warning',
              position: 'bottom-center',
              duration: 3500,
            });
          }
        });
      } else {
        this.$toasted.show(ErrMsg, {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      }
    },
    ShowDelLinkDialog(LinkItem, Index) {
      this.DelLinkInfo.Serial = LinkItem.Serial;
      this.DelLinkInfo.Index = Index;
      this.dialogDelLink.title = this.$t('SURREALM.Files.Warning');
      this.dialogDelLink.msg = this.$t('SURREALM.Files.DelMsg');
      this.dialogDelLink.isLeftBtnShow = true;
      this.dialogDelLink.txtLeftBtn = this.$t('SURREALM.Files.DelLeftBtn');
      this.dialogDelLink.txtRightBtn = this.$t('SURREALM.Files.DelRightBtn');
      this.dialogDelLink.show = true;
    },
    CloseDelLinkDialog() {
      this.DelLinkInfo.Serial = null;
      this.DelLinkInfo.Index = null;
      this.dialogDelLink.title = '';
      this.dialogDelLink.msg = '';
      this.dialogDelLink.isLeftBtnShow = true;
      this.dialogDelLink.txtLeftBtn = '';
      this.dialogDelLink.txtRightBtn = '';
      this.dialogDelLink.show = false;
    },
    DelLink() {
      apiDelLink(this.DelLinkInfo.Serial).then((res) => {
        if (res.data.Status == 'ok') {
          this.Link.Links.splice(this.DelLinkInfo.Index, 1);
          this.CloseDelLinkDialog();
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },
    SetImage(image) {
      this.Lecture.Image = image;
      this.DefaultImage = image;
      this.Image.ChangePhoto = true;
    },
    GetDefaultImage(callback) {
      let DefaultPhoto = require('@/assets/img/SURREALM/Backend/LectureManager/default_lecture.jpg');
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function () {
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var dataURL;
        canvas.height = this.naturalHeight;
        canvas.width = this.naturalWidth;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL();
        callback(dataURL);
      };
      img.src = DefaultPhoto;
    },
    GetDefaultImageCallback(dataURL) {
      this.Lecture.Image = dataURL;
      this.DefaultImage = dataURL;
    },
    RemoveModel(Model) {
      let Index = this.Lecture.Models.findIndex((obj) => obj.Serial == Model.Serial);
      this.Lecture.Models.splice(Index, 1);
      this.$toasted.show(this.$t('SURREALM.LectureOwn.ModelDelDone', { Name: Model.Name }), {
        icon: 'warning',
        position: 'bottom-center',
        duration: 3500,
      });
    },
    RoomTypeToText(Type) {
      return this.TypeOptions == null ? 0 : this.TypeOptions.find((obj) => obj.Type == Type).Text;
    },
  },
  components: {
    Datepicker,
    CropperView,
    Loading,
    DialogMsg,
  },
};
</script>