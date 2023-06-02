<template>
  <div class="pnlDialogFull" v-if="show" style="">
    <div class="pnlDialogGray">
      <!-- @click.self="CloseDialog" -->
      <div class="pnlDialogAddLecture">
        <div class="pnlTitle">
          <label v-show="CurrentStep == 1">{{ $t('SURREALM.LectureOwn.AddDialogTitle1') }}</label>
          <label v-show="CurrentStep == 2">{{ $t('SURREALM.LectureOwn.AddDialogTitle2') }}</label>
          <label v-show="CurrentStep == 3">{{ $t('SURREALM.LectureOwn.AddDialogTitle2_2') }}</label>
          <label v-show="CurrentStep == 4">{{ $t('SURREALM.LectureOwn.AddDialogTitle3') }}</label>
          <label v-show="CurrentStep == 5">{{ $t('SURREALM.LectureOwn.AddDialogTitle4') }}</label>
          <label v-show="CurrentStep == 6">{{ $t('SURREALM.LectureOwn.AddDialogTitle5') }}</label>
          <label v-show="CurrentStep == 7">{{ $t('SURREALM.LectureOwn.AddDialogTitle6') }}</label>
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
            <template v-if="StreamingAuth">
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
            </template>
            <template v-else>
              <div class="keyinTitle"></div>
              <div class="keyinSubContent lectureStream"></div>
            </template>

            <div class="keyinTitle">{{ $t('SURREALM.LectureOwn.LectureDes') }}</div>
            <div class="keyinContent">
              <textarea
                v-model="Lecture.Des"
                class="lectureDes"
                :placeholder="$t('SURREALM.LectureOwn.Placeholder.Des')"
              ></textarea>
            </div>
          </div>
          <div class="step1_2" v-show="CurrentStep == 2">
            <label class="SelectModelTitle" v-html="$t('SURREALM.LectureOwn.SelectModelTitle')"></label>
            <div class="modelArea">
              <div v-for="model in Lecture.Models" :key="model.Serial" class="selectModel">
                <img :src="model.PhotoUrl" />
                <label>{{ model.Name }}</label>
                <button @click="RemoveModel(model)">{{ $t('SURREALM.LectureOwn.DelModel') }}</button>
              </div>
              <button v-for="x in CalcSelectModelNum" :key="`key${x}`" class="btnSelectModel" @click="ShowSelectModel">
                {{ $t('SURREALM.LectureOwn.SelectModel') }}
              </button>
              <div style="clear: both"></div>
            </div>
          </div>
          <div ref="stepheader" class="step1_3" v-show="CurrentStep == 3">            
            <div class="space-img">
              <img src="@/assets/img/SURREALM/Backend/LectureManager/exploration_space.jpg">
            </div>
            <div class="total-score-title">{{ $t('SURREALM.LectureOwn.TotalScore') }}80{{ $t('SURREALM.LectureOwn.ScoreUtil') }}</div>
            <div class="picture-frame" v-for="index in 20" :key="index">
              <div class="frame-title">{{ $t('SURREALM.LectureOwn.PictureFrame') }}{{ index }}</div>
              <div class="keyinTitle">{{ $t('SURREALM.LectureOwn.SelectMaterial') }}</div>
              <div class="keyinContent">
                  <input type="radio" :name="'material_select['+index+']'" :id="'material['+index+']'" value="1" v-model="CourseFrames[index - 1].Type" @change="onChangeCourseFrame()"/>
                  <label :for="'material['+index+']'"><span></span>{{ $t('SURREALM.LectureOwn.Material') }}</label>
                  <input type="radio" :name="'material_select['+index+']'" :id="'default['+index+']'" value="0" v-model="CourseFrames[index - 1].Type" @change="onChangeCourseFrame()"/>
                  <label :for="'default['+index+']'"><span></span>{{ $t('SURREALM.LectureOwn.Default') }}</label>
              </div>
              <div class="input-container">                            
                <select class="tableSelect" v-model="CourseFrames[index - 1].MaterialType" :disabled="CourseFrames[index - 1].Type == '0'" @change="SearchMaterialList(index - 1, CourseFrames[index - 1].MaterialType, CourseFrames[index - 1].MaterialCategory)">
                    <option value="">{{ $t('SURREALM.MaterialLib.MaterialType') }}</option>
                    <option v-for="(type, index) in MaterialTypes" :key="index" :value="type.id">
                      {{ type.name }}
                    </option>
                </select>
                <select class="tableSelect" v-model="CourseFrames[index - 1].MaterialCategory" :disabled="CourseFrames[index - 1].Type == '0'" @change="SearchMaterialList(index - 1, CourseFrames[index - 1].MaterialType, CourseFrames[index - 1].MaterialCategory)">
                  <option value="">{{ $t('SURREALM.MaterialLib.Category') }}</option>
                  <option v-for="(category, index) in Categories" :key="index" :value="category">
                    {{ category }}
                  </option>
                </select>
                <div class="calculate-score">                 
                  <label>{{ $t('SURREALM.LectureOwn.CalculateScore') }}</label>
                  <input class="lectureName" type="text" v-model="CourseFrames[index - 1].Score" :disabled="CourseFrames[index - 1].Type == '0' || CourseFrames[index - 1].Material == null || CourseFrames[index - 1].Material.Question.length == 0"/>
                </div>
              </div>
              <div class="input-container">      
                <select class="tableSelect2" v-model="CourseFrames[index - 1].MaterialSerial" :disabled="CourseFrames[index - 1].Type == '0'" @change="onChangeMaterial($event, index - 1)">
                  <option value="">{{ $t('SURREALM.MaterialLib.MaterialName') }}</option>
                  <option v-for="(material, index) in CourseFrames[index - 1].MaterialList" :key="index" :value="material.Serial">
                    {{ material.Name }}
                  </option>
                </select>
              </div>
              <hr class="line-space"/>        
            </div>
            <div class="foolder-dec">{{ $t('SURREALM.LectureOwn.SelectMaterialDec') }}</div>
          </div>
          <div class="step2" v-show="CurrentStep == 4">
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
            <label class="selectedNumber" style="top: 60px">{{
              `學校同時段可上線人數 ${SchoolCurrentPeople} / ${Edu.MaxNumber}`
            }}</label>
            <label class="selectedNumber">{{
              `${$t('SURREALM.LectureOwn.SelectedNumber')} ${Student.Select.length} / ${PeopleMax}`
            }}</label>
            <div style="clear: both"></div>
            <div class="fliterArea">
              <div class="hintTxt">※同時段已被其他老師預約的學生不會出現在清單中</div>
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
          <div class="step3" v-show="CurrentStep == 5">
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
          <div class="step4" v-show="CurrentStep == 6">
            <CropperView :defaultImage="DefaultImage" @set-image="SetImage" />
          </div>
          <div class="step5" v-show="CurrentStep == 7">
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
            {{ CurrentStep == 7 ? $t('SURREALM.LectureOwn.Release') : $t('SURREALM.LectureOwn.NextStep') }}
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

    <DialogTeachingCoolSelect
      :show="dialogSelectModel.show"
      :option="dialogSelectModel.option"
      @close-dialog="CloseSelectModel"
      @add-answer="AddModel"
    ></DialogTeachingCoolSelect>
  </div>
</template>
<script>
import '@/assets/js/dateFormat.js';
import Datepicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import CropperView from '@/components/SURREALM/Backend/CropperView.vue';
import DialogMsg from '@/components/SURREALM/Backend/DialogMsg.vue';
import DialogTeachingCoolSelect from '@/components/SURREALM/Backend/DialogTeachingCoolSelect.vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import {
  apiGetTag,
  apiGetNewLectureStudent,
  apiAddLink,
  apiGetLink,
  apiDelLink,
  apiAddLecture,
  apiUpdateLecture,
  apiGetLectureType,
  apiGeMaxUsingNo,
  apiGetTeachingCool,
  apiGetCourseFrame,
  apiEditCourseFrame,
  apiSearchMaterialList
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
      dialogSelectModel: {
        show: false,
        option: [],
      },
      ModelMaxNum: 6,
      CurrentStep: 1,
      Lecture: {
        Name: '',
        Date: '',
        Time: [],
        Type: '100',
        Auth: 'private',
        IsStreaming: false,
        Des: '',
        Image: '',
        Models: [],
      },
      Edu: {
        MaxNumber: 0,
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
      TypeOptions: [
        {Type:"100", Text:" 一般教室 "},
        {Type:"1004", Text:"專科教室－知識探索空間"},
        {Type:"200", Text:"專科教室－教具酷"},
      ],
      MaterialTypes: [
        {id:"pic", name:"圖片"},
        {id:"video", name:"影片"},
        {id:"quick_resp_qn", name:"搶答題目"}
      ],
      Categories: ["課程1", "課程2", "課程3", "課程4", "課程5", "課程6", "課程7", "課程8", "課程9", "課程10"],
      CourseFrames: [],
      DelLinkInfo: {
        Serial: null,
        Index: null,
      },
      StreamingAuth: false,
    };
  },
  mounted() {
    this.GetDefaultCourseFrame();
    this.GetLinks();
    this.GetTags();
    this.GetModels();
    this.GetLectureType();
    this.StreamingAuth = localStorage.getItem('StreamingAuth') == 'T' ? true : false;    
  },
  computed: {
    SchoolCurrentPeople: function () {
      return this.Edu.CurrentNumber + this.Student.Select.length;
    },
    PeopleMax: function () {
      return 29;
      //return localStorage.getItem('StudentNo');
      //return this.TypeOptions == null ? 0 : this.TypeOptions.find((obj) => obj.Type == this.Lecture.Type).Value;
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
        this.Lecture.IsStreaming = this.Lecture.IsStreaming != 'T' ? false : true;
        this.Student.Select = this.DeepCopy(obj.Student);
        this.Serial = obj.Serial;
        this.LectureCode = obj.LectureCode;
      }
    },
    show(bool) {
      if (!bool) {
        this.Lecture = {
          Name: '',
          Date: '',
          Time: [],
          Type: '100',
          Auth: 'private',
          IsStreaming: false,
          Des: '',
          Image: '',
          Models: [],
        };
        this.Student.Select = [];
        this.Serial = null;
        this.LectureCode = '';
      }
    },
  },
  methods: {
    CloseDialog() {
      this.scrollToTop();
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
        if ((this.CurrentStep == 4 && this.Lecture.Type != '200' && this.Lecture.Type != '1004') ||
             this.CurrentStep == 3 && this.Lecture.Type == '1004') {
          this.scrollToTop();
          this.CurrentStep = 1;
        } else if (this.CurrentStep == 4 && this.Lecture.Type == '200') {
          this.CurrentStep = this.CurrentStep - 2;
        } else {
          if (this.CurrentStep == 5) {
            this.GeMaxUsingNo();
          }
          this.CurrentStep--;
        }
      }
    },
    NextStep() {
      if (this.CurrentStep == 1) {
        let errMsg = this.CheckStep1Info();
        if (errMsg == '') {
          this.GeMaxUsingNo();
          if (this.Lecture.Type == '200') {
            this.CurrentStep++;
          } else if (this.Lecture.Type == '1004') {            
            this.CurrentStep = this.CurrentStep + 2;
            if(this.Serial != null) {
              this.GetCourseFrame();
            }            
          } else {
            this.CurrentStep = this.CurrentStep + 3;
            this.Lecture.Models = [];
            this.GetStudent(this.Student.Tag);
          }
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
          this.CurrentStep = this.CurrentStep + 2;
          this.GetStudent(this.Student.Tag);
        } else {
          this.$toasted.show(errMsg, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      } else if (this.CurrentStep == 3) {
        this.scrollToTop();
        let errMsg = this.CheckStep1_2Info();
        if (errMsg == '') {
          this.CurrentStep++;
          this.GetStudent(this.Student.Tag);
        } else {
          this.$toasted.show(errMsg, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      } else if (this.CurrentStep == 4) {
        let errMsg = this.CheckStep3Info();
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
        if (this.Lecture.Image == '') {
          this.GetDefaultImage(this.GetDefaultImageCallback);
        } else {
          this.DefaultImage = this.Lecture.Image;
        }
        this.CurrentStep++;
      } else if (this.CurrentStep == 6) {
        let errMsg = this.CheckStep5Info();
        if (errMsg == '') {
          this.CurrentStep++;
        } else {
          this.$toasted.show(errMsg, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      } else if (this.CurrentStep == 7) {
        let data = {
          Student: this.Student.Select,
          Lecture: this.Lecture,
        };
        data.Lecture.IsStreaming = data.Lecture.IsStreaming == true ? 'T' : 'F';
        this.loadingInfo.isLoading = true;
        if (this.defaultValue != null) {
          let tmpImage = data.Lecture.Image;
          //Updata沒換過圖不重複上傳
          data.Lecture.Image = this.Image.ChangePhoto ? data.Lecture.Image : '';
          data.Serial = this.Serial;
          data.LectureCode = this.LectureCode;
          apiUpdateLecture(data).then((res) => {
            this.loadingInfo.isLoading = false;
            if (res.data.Status == 'ok') {
              //把圖補回來
              if (data.Lecture.Image == '') {
                data.Lecture.Image = tmpImage;
              }

              this.EditCourseFrame('edit', data);              
            } else {
              this.$toasted.show(res.data.Error, {
                icon: 'warning',
                position: 'bottom-center',
                duration: 3500,
              });
              //有錯的話不要把視窗關了 讓他們有修改的機會 應該是共用人數的問題
            }
          });
        } else {
          apiAddLecture(data).then((res) => {
            this.loadingInfo.isLoading = false;
            if (res.data.Status == 'ok') {
              data.Serial = res.data.Serial;
              data.LectureCode = res.data.LectureCode;
              
              this.EditCourseFrame('add', data);              
            } else {
              this.$toasted.show(res.data.Error, {
                icon: 'warning',
                position: 'bottom-center',
                duration: 3500,
              });
              //有錯的話不要把視窗關了 讓他們有修改的機會 應該是共用人數的問題
            }
          });
        }
      }
    },
    scrollToTop() {
        const container = this.$refs.stepheader;
        container.scrollTop = 0;
    },
    GeMaxUsingNo() {
      let CalcSerial = this.defaultValue == null ? 0 : this.Serial;
      apiGeMaxUsingNo(this.Lecture.Date, this.Lecture.Time[0], this.Lecture.Time[1], CalcSerial).then((res) => {
        if (res.data.Status == 'ok') {
            this.Edu.MaxNumber = res.data.MaxNumber;
            this.Edu.CurrentNumber = res.data.CurrentNumber;
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
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
      } 
      // else if (this.Lecture.Des.length < 10) {
      //   errMsg = this.$t('SURREALM.LectureOwn.Err.Des');
      // }

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
      if (this.Lecture.Models.length == 0) {
        errMsg = this.$t('SURREALM.LectureOwn.Err.PlzSelectModel');
      }
      return errMsg;
    },
    CheckStep1_2Info() {
      let errMsg = '';
      // if (this.Lecture.Models.length == 0) {
      //   errMsg = this.$t('SURREALM.LectureOwn.Err.PlzSelectModel');
      // }
      return errMsg;
    },
    CheckStep3Info() {
      let errMsg = '';
      if (this.Student.Select.length == 0) {
        errMsg = this.$t('SURREALM.LectureOwn.Err.StudentLength');
      } else if (this.Student.Select.length > this.PeopleMax) {
        errMsg = this.$t('SURREALM.LectureOwn.Err.OverMax');
      }
      return errMsg;
    },
    CheckStep5Info() {
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
    SearchMaterialList(index, type, category) {      
      if (type != null && category != null && type != "" && category != "") {
        apiSearchMaterialList(type, category).then((res) => {        
          if (res.data.Status == 'ok') {   
            // console.log(res.data.Materials);  
            this.CourseFrames[index].MaterialList = res.data.Materials;
            if (this.CourseFrames[index].MaterialList == null || this.CourseFrames[index].MaterialList.length == 0) {
              this.CourseFrames[index].Material = null;
            }
            this.onChangeCourseFrame();
          } else {
            this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
              icon: 'warning',
              position: 'bottom-center',
              duration: 3500,
            });
          }
        });
      }
    },    
    onChangeMaterial(event, index) {
      //console.log(event.target.value)
      const item = this.CourseFrames[index].MaterialList.find(it => it.Serial == event.target.value);
      this.CourseFrames[index].Material = item;
      this.onChangeCourseFrame();
    },
    onChangeCourseFrame() {
      let tmp = this.CourseFrames;
      this.CourseFrames = [];
      this.CourseFrames = tmp;
    },
    GetDefaultCourseFrame() {
        for(var i = 0; i < 20; i ++) {
          var CourseFrame = {
            "Type": '0',
            "Owner": null,
            "Course": null,
            "LectureSerial": null,
            "LectureCode": null,
            "FrameSerial": i + 1,
            "MaterialSerial": null,
            "Score": "",
            "MaterialType": "",
            "MaterialCategory": "",
            "MaterialList": [],
            "Material": null,
          }
          Object.keys(CourseFrame).forEach((key) => {
            let internalValue = CourseFrame[key];
            Object.defineProperty(CourseFrame, key, {
              get() {
                // console.log(`Get ${key}: ${internalValue}`);
                return internalValue;
              },

              set(newValue) {
                // console.log(`Set ${key} from ${internalValue} to ${newValue}`);
                internalValue = newValue;
              },
            });
          });
          this.CourseFrames[i] = CourseFrame;
        }        
        //console.log(this.CourseFrames);
    },
    GetCourseFrame() {
      if (this.Serial != null) {
        console.log("this.Serial-->"+this.Serial);
        apiGetCourseFrame(this.Serial).then((res) => {
          if (res.data.Status == 'ok') {
            console.log(res.data.Frames);
            this.CourseFrames = res.data.Frames;
          } else {
            this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
              icon: 'warning',
              position: 'bottom-center',
              duration: 3500,
            });
          }
        });
      }
    },
    EditCourseFrame(action, data) {
      console.log(localStorage.getItem('Name'));  
      console.log(data);      
      var MaterialList = this.CourseFrames.filter(function(value) {
        return value.Type == 1;
      });
      MaterialList = MaterialList.map(function (material) {
        var CourseFrame = {            
          "Owner": localStorage.getItem('Name'),
          "Course": data.Lecture.Name,
          "LectureSerial": data.Serial,
          "LectureCode": data.LectureCode,
          "FrameSerial": material.FrameSerial,
          "MaterialSerial": material.MaterialSerial,
          "Score": material.Score
        }
        return CourseFrame;
      });
      let jsonData = JSON.stringify({"CourseFrame": MaterialList});
      console.log(jsonData);
      apiEditCourseFrame(data.Serial, jsonData).then((res) => {
        if (res.data.Status == 'ok') {
          this.$emit(action, data);
            this.Image.ChangePhoto = false;
            this.CloseDialog();
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });      
    },
    GetModels() {
      apiGetTeachingCool().then((res) => {
        if (res.data.Status == 'ok') {
          this.dialogSelectModel.option = res.data.ModelList;
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });

      // this.dialogSelectModel.option = [
      //   {
      //     Serial: 1,
      //     Name: '口腔與唾腺',
      //     PhotoUrl: 'https://surreal-edu.s3-ap-northeast-1.amazonaws.com/server/biCh04_DigestiveSystem01_mouth.png',
      //   },
      //   {
      //     Serial: 2,
      //     Name: '胃、胰、肝與十二指腸',
      //     PhotoUrl: 'https://surreal-edu.s3-ap-northeast-1.amazonaws.com/server/biCh04_DigestiveSystem03.png',
      //   },
      //   {
      //     Serial: 3,
      //     Name: '人體的消化管與消化腺',
      //     PhotoUrl: 'https://surreal-edu.s3-ap-northeast-1.amazonaws.com/server/biCh04_DigestiveSystem.png',
      //   },
      //   {
      //     Serial: 4,
      //     Name: '模型4',
      //     PhotoUrl: 'https://surreal-edu.s3-ap-northeast-1.amazonaws.com/server/biCh04_DigestiveSystem01_mouth.png',
      //   },
      //   {
      //     Serial: 5,
      //     Name: '模型5',
      //     PhotoUrl: 'https://surreal-edu.s3-ap-northeast-1.amazonaws.com/server/biCh04_DigestiveSystem01_mouth.png',
      //   },
      //   {
      //     Serial: 6,
      //     Name: '模型6',
      //     PhotoUrl: 'https://surreal-edu.s3-ap-northeast-1.amazonaws.com/server/biCh04_DigestiveSystem01_mouth.png',
      //   },
      //   {
      //     Serial: 7,
      //     Name: '模型7',
      //     PhotoUrl: 'https://surreal-edu.s3-ap-northeast-1.amazonaws.com/server/biCh04_DigestiveSystem01_mouth.png',
      //   },
      // ];
    },
    GetStudent(tag) {
      apiGetNewLectureStudent(tag, this.Lecture.Date, this.Lecture.Time[0], this.Lecture.Time[1]).then((res) => {
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
      if (this.SchoolCurrentPeople >= this.Edu.MaxNumber) {
        this.$toasted.show('超過同時段人數上限！請調整人數或上課時間。', {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      } else if (this.Student.Select.length >= this.PeopleMax) {
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
    ShowSelectModel() {
      this.dialogSelectModel.show = true;
    },
    CloseSelectModel() {
      this.dialogSelectModel.show = false;
    },
    AddModel(data) {
      if (this.Lecture.Models.length < this.ModelMaxNum) {
        let IndexOf = this.Lecture.Models.findIndex((obj) => obj.Serial == data.Serial);
        if (IndexOf < 0) {
          this.Lecture.Models.push(data);
          this.CloseSelectModel();
          this.$toasted.show(this.$t('SURREALM.LectureOwn.ModelAddDone', { Name: data.Name }), {
            icon: 'check',
            position: 'bottom-center',
            duration: 3500,
          });
        } else {
          this.$toasted.show(this.$t('SURREALM.LectureOwn.Err.ModelRepear'), {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      } else {
        this.$toasted.show(this.$t('SURREALM.LectureOwn.Err.ModelMaxLimit', { Num: this.ModelMaxNum }), {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      }
    },
  },
  components: {
    Datepicker,
    CropperView,
    Loading,
    DialogMsg,
    DialogTeachingCoolSelect,
  },
};
</script>